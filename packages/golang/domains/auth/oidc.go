package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"strings"
	"time"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type AuthOIDC struct {
	oidcConfig       *config.OIDC
	oidcProvider     *oidc.Provider
	oidcOAuth2Config *oauth2.Config
}

func newOIDC(c *config.OIDC) *AuthOIDC {
	oidcProvider, err := oidc.NewProvider(context.Background(), c.IssuerURL)
	if err != nil {
		log.Errorf("oidc.NewProvider failed -> %v", err)
		panic(err)
	}

	return &AuthOIDC{
		oidcConfig:       c,
		oidcProvider:     oidcProvider,
		oidcOAuth2Config: nil,
	}
}

func (ao *AuthOIDC) verifyAccessToken(r *http.Request, userID string, ssoToken domains.AdminUserSSOToken) bool {
	ctx := r.Context()
	// IDトークンの検証
	// vironではIDトークンはDBに保存されているので、改竄されることはないが
	// DBはviron利用者が管理するため改竄されることを考慮してvironLibとしてはIDトークンの検証を毎度行う
	verifier, err := ao.getTokenVerifier()
	if err != nil {
		log.Errorf("getTokenVerifier failed -> %v", err)
		return false
	}
	idToken, errVerify := verifier.Verify(ctx, ssoToken.IdToken)
	if errVerify == nil {
		// リフレッシュトークンがない場合はIDトークンの有効期限だけで判定
		if ssoToken.RefreshToken == nil && idToken.Expiry.Before(time.Now()) {
			log.Error("IDToken is expired.")
			return false
		}
		// リフレッシュが必要なければtrueを返す
		if !ao.isAccessTokenRefresh(idToken.Expiry) {
			return true
		}
	} else {
		// errVerifyがTokenExpiredErrorの場合でリフレッシュトークンがある場合はリフレッシュ
		if _, ok := errVerify.(*oidc.TokenExpiredError); ok && ssoToken.RefreshToken != nil {
			log.Info("The ID token expired, but I had a refresh token, so I refreshed it.")
		} else {
			log.Errorf("IDToken verify failed -> %v", errVerify)
			return false
		}
	}

	// ---- 以下リフレッシュトークンがある場合の処理 ----
	// リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
	config := ao.getOAuth2Config("")
	token := &oauth2.Token{
		AccessToken:  ssoToken.AccessToken,
		TokenType:    ssoToken.TokenType,
		RefreshToken: *ssoToken.RefreshToken,
		Expiry:       time.Unix(0, int64(ssoToken.ExpiryDate)*int64(time.Millisecond)),
	}
	newToken, errRefreshToken := config.TokenSource(ctx, token).Token()
	if errRefreshToken != nil {
		log.Errorf("TokenSource failed -> %v", err)
		return false
	}

	// IDトークンを取得
	rawIDToken, ok := newToken.Extra("id_token").(string)
	if !ok {
		log.Error("id_token not found")
		return false
	}

	// 新しいクレデンシャルをDBに更新
	ssoToken.AccessToken = newToken.AccessToken
	ssoToken.TokenType = newToken.TokenType
	ssoToken.RefreshToken = &newToken.RefreshToken
	ssoToken.IdToken = rawIDToken
	expiry := int64(newToken.Expiry.UnixNano() / int64(time.Millisecond))
	ssoToken.ExpiryDate = expiry

	// 更新したクレデンシャルをDBに保存
	if err := domains.UpdateAdminUserSSOTokenByUserID(ctx, ao.oidcConfig.ClientID, userID, ssoToken); err != nil {
		log.Errorf("UpdateOneAdminUserSSOTokenByUserID failed -> %v", err)
		return false
	}

	return true
}

func (ao *AuthOIDC) getTokenVerifier() (*oidc.IDTokenVerifier, *errors.VironError) {
	oidcConfig := &oidc.Config{
		ClientID: ao.oidcConfig.ClientID,
	}
	return ao.oidcProvider.Verifier(oidcConfig), nil
}

func (ao *AuthOIDC) getOAuth2Config(redirectUrl string) *oauth2.Config {
	if ao.oidcOAuth2Config != nil {
		return ao.oidcOAuth2Config
	}
	scope := constant.OIDC_DEFAULT_SCOPES
	if len(ao.oidcConfig.AdditionalScope) > 0 {
		scope = append(constant.OIDC_DEFAULT_SCOPES, ao.oidcConfig.AdditionalScope...)
	}
	config := &oauth2.Config{
		ClientID:     ao.oidcConfig.ClientID,
		ClientSecret: ao.oidcConfig.ClientSecret,
		Endpoint:     ao.oidcProvider.Endpoint(),
		Scopes:       scope,
		RedirectURL:  redirectUrl,
	}
	// redirectUrlが空以外の場合にキャッシュ
	if redirectUrl != "" {
		ao.oidcOAuth2Config = config
	}
	return config
}

func (ao *AuthOIDC) allowUserHostedDomains(email string) bool {
	if len(ao.oidcConfig.UserHostedDomains) == 0 {
		return true
	}
	emailDomain := email[strings.Index(email, "@")+1:]
	for _, v := range ao.oidcConfig.UserHostedDomains {
		if v == emailDomain {
			return true
		}
	}
	return false
}

func (ao *AuthOIDC) isAccessTokenRefresh(expiry time.Time) bool {
	// 有効期限の30秒前からリフレッシュ
	return expiry.Add(-constant.OIDC_REFRESH_THRESHOLD).Before(time.Now())
}

// ランダムな `code_verifier` を生成
func (ao *AuthOIDC) genCodeVerifier() string {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b)
}

func (ao *AuthOIDC) getAuthorizationUrl(redirectUrl string, codeVerifier string, state string) string {
	cfg := ao.getOAuth2Config(redirectUrl)
	return cfg.AuthCodeURL(
		state,
		oauth2.S256ChallengeOption(codeVerifier),
		oauth2.AccessTypeOffline,
		oauth2.ApprovalForce,
	)
}

func (ao *AuthOIDC) signin(r *http.Request, redirectUrl string, code string, state string, codeVerifier string, multipleAuthUser bool) (string, *errors.VironError) {
	ctx := r.Context()

	// 設定取得
	oauth2Config := ao.getOAuth2Config(redirectUrl)

	// 許可コードとトークンを交換
	oidcToken, errExchange := oauth2Config.Exchange(
		ctx,
		code,
		oauth2.SetAuthURLParam("code_verifier", codeVerifier),
		oauth2.SetAuthURLParam("state", state),
	)
	if errExchange != nil {
		log.Errorf("Exchange failed -> %v", errExchange)
		return "", errors.SigninFailed
	}

	// IDトークンを取得
	rawIDToken, ok := oidcToken.Extra("id_token").(string)
	if !ok {
		log.Error("id_token not found")
		return "", errors.SigninFailed
	}

	// IDトークン検証機を取得
	verifier, errVerifier := ao.getTokenVerifier()
	if errVerifier != nil {
		log.Errorf("getTokenVerifier failed -> %v", errVerifier)
		return "", errors.SigninFailed
	}

	// IDトークンを検証
	idToken, errVerify := verifier.Verify(ctx, rawIDToken)
	if errVerify != nil {
		log.Errorf("Verify failed -> %v", errVerify)
		return "", errors.SigninFailed
	}

	// email取得
	var claims struct {
		Email string `json:"email"`
	}
	if err := idToken.Claims(&claims); err != nil {
		log.Errorf("Claims failed -> %v", err)
		return "", errors.SigninFailed
	}

	// emailが取得できない場合はエラー
	if claims.Email == "" {
		log.Error("Email not found")
		return "", errors.SigninFailed
	}

	// emailドメインが許可されているか確認
	if !ao.allowUserHostedDomains(claims.Email) {
		log.Error("domainCheck is false.")
		return "", errors.SigninFailed
	}

	// ユーザーが存在しない場合は作成
	user := domains.FindByEmail(ctx, claims.Email)

	// SSOトークンはUpsert
	expiry := int64(oidcToken.Expiry.UnixNano() / int64(time.Millisecond))
	ssoToken := &domains.AdminUserSSOToken{
		AuthType:     constant.AUTH_TYPE_OIDC,
		Provider:     ao.oidcConfig.Provider,
		ClientID:     ao.oidcConfig.ClientID,
		TokenType:    oidcToken.TokenType,
		IdToken:      rawIDToken,
		AccessToken:  oidcToken.AccessToken,
		RefreshToken: &oidcToken.RefreshToken,
		ExpiryDate:   expiry,
	}

	if user == nil {
		// adminUser Entity
		userPayload := &domains.AdminUser{
			Email: claims.Email,
		}
		var err error
		// 初回の管理者ユーザー作成
		user, ssoToken, err = createFirstAdminUser(ctx, userPayload, ssoToken, constant.AUTH_TYPE_OIDC)
		if err != nil {
			log.Errorf("create first admin user failed err:%v, user:%v", err, user)
			return "", errors.SigninFailed
		}

		// 管理者ユーザー存在する場合はviewerユーザー作成
		if user == nil {
			if user, ssoToken, err = createViewer(ctx, userPayload, ssoToken, constant.AUTH_TYPE_OIDC); err != nil {
				log.Errorf("create admin user(viewer) failed err:%v, user:%v ssoToken", err, user, ssoToken)
			}
		}
	} else {
		// userが存在する場合
		// multipleAuthUser=falseの場合は認証方法は1つのみに制限する
		if !multipleAuthUser {
			// 登録済みユーザーの認証方法の確認
			// password認証が登録済みの場合はエラー
			if user.Password != nil {
				log.Error("user already exists with password.")
				return "", errors.SigninFailed
			}
			// userIdで登録済みSSOトークン情報を取得
			ssoTokens, err := domains.ListAdminUserSSOToken(ctx, &domains.AdminUserSSOTokenConditions{UserID: user.ID, Size: 10000})
			if err != nil {
				log.Errorf("ListAdminUserSSOToken failed err:%v", err)
				return "", errors.SigninFailed
			}
			// 今回のclientIDと違うSSOトークンがある場合はエラー
			for _, v := range ssoTokens.List {
				if v.ClientID != ssoToken.ClientID {
					log.Error("user already exists with oidc.")
					return "", errors.SigninFailed
				}
			}
		}

		// SSOトークンのUserIDを設定
		ssoToken.UserID = user.ID

		// ここまででエラーがない場合はSSOトークンのUpsert
		if err := domains.UpsertAdminUserSSOToken(ctx, ssoToken); err != nil {
			log.Errorf("UpsertAdminUserSSOToken failed err:%v", err)
			return "", errors.SigninFailed
		}
	}

	// JWTトークンを作成
	token, errSign := Sign(r, user.ID)
	if errSign != nil {
		log.Error("Signin sign failed %#v \n", errSign)
		return "", errors.SigninFailed
	}
	return token, nil
}
