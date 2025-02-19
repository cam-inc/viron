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

var (
	oidcConfig       *config.Oidc
	oidcProvider     *oidc.Provider
	oidcOAuth2Config *oauth2.Config
)

func NewOidc(c *config.Oidc) {
	oidcConfig = c
	var err error
	oidcProvider, err = oidc.NewProvider(context.Background(), c.IssuerURL)
	if err != nil {
		log.Errorf("oidc.NewProvider failed -> %v", err)
		panic(err)
	}
}

// ランダムな `code_verifier` を生成
func GenCodeVerifier() string {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b)
}

func GetOidcAuthorizationUrl(redirectUrl string, codeVerifier string, state string) string {
	cfg := getOidcOAuth2Config(redirectUrl, oidcConfig)
	return cfg.AuthCodeURL(
		state,
		oauth2.S256ChallengeOption(codeVerifier),
	)
}

func SigninOidc(code string, state string, codeVerifier string, redirectUrl string, r *http.Request) (string, *errors.VironError) {
	ctx := r.Context()

	// 設定取得
	config := getOidcOAuth2Config(redirectUrl, oidcConfig)

	// 許可コードとトークンを交換
	oidcToken, errExchange := config.Exchange(
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
	verifier, errVerifier := getOidcTokenVerifier(oidcConfig)
	if errVerifier != nil {
		log.Errorf("getOidcTokenVerifier failed -> %v", errVerifier)
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
	userHostedDomains := oidcConfig.UserHostedDomains
	emailDomain := claims.Email[strings.Index(claims.Email, "@")+1:]
	domainCheck := false
	for _, v := range userHostedDomains {
		if v == emailDomain {
			domainCheck = true
			break
		}
	}
	if !domainCheck {
		log.Error("domainCheck is false.")
		return "", errors.SigninFailed
	}

	// ユーザーが存在しない場合は作成
	user := domains.FindByEmail(ctx, claims.Email)
	if user == nil {
		expiry := uint64(oidcToken.Expiry.UnixNano() / int64(time.Millisecond))
		payload := &domains.AdminUser{
			Email:            claims.Email,
			OidcTokenType:    &oidcToken.TokenType,
			OidcIdToken:      &rawIDToken,
			OidcAccessToken:  &oidcToken.AccessToken,
			OidcRefreshToken: &oidcToken.RefreshToken,
			OidcExpiryDate:   &expiry,
			AuthType:         constant.AUTH_TYPE_OIDC,
		}
		var err error
		// 初回の管理者ユーザー作成
		user, err = createFirstAdminUser(ctx, payload, payload.AuthType)
		if err != nil {
			log.Errorf("create first admin user failed err:%v, user:%v", err, user)
			return "", errors.SigninFailed
		}

		// 管理者ユーザー存在する場合はviewerユーザー作成
		if user == nil {
			if user, err = createViewer(ctx, payload, payload.AuthType); err != nil {
				log.Errorf("create admin user(viewer) failed err:%v, user:%v", err, user)
			}
		}
	}

	// 認証タイプがoidcでない場合はエラー
	if user.AuthType != constant.AUTH_TYPE_OIDC {
		log.Error("user authType is not oidc.")
		return "", errors.SigninFailed
	}

	// JWTトークンを作成
	token, errSign := Sign(r, user.ID)
	if errSign != nil {
		log.Error("SigninOidc sign failed %#v \n", errSign)
		return "", errors.SigninFailed
	}
	return token, nil
}

func VerifyOidcAccessToken(r *http.Request, userID string, credentials *domains.AdminUser) bool {
	// credentialsが不正の場合はエラー
	if credentials == nil ||
		credentials.OidcAccessToken == nil ||
		credentials.OidcExpiryDate == nil ||
		credentials.OidcTokenType == nil ||
		credentials.OidcIdToken == nil ||
		credentials.OidcRefreshToken == nil {
		log.Errorf("credentials is invalid -> %+v", credentials)
		return false
	}

	ctx := r.Context()

	// IDトークンの検証
	// vironではIDトークンはDBに保存されているので、改竄されることはないが
	// DBはviron利用者が管理するため改竄されることを考慮してvironLibとしてはIDトークンの検証を毎度行う
	verifier, err := getOidcTokenVerifier(oidcConfig)
	if err != nil {
		log.Errorf("getOidcTokenVerifier failed -> %v", err)
		return false
	}
	idToken, errVerify := verifier.Verify(ctx, *credentials.OidcIdToken)
	if errVerify == nil {
		// リフレッシュトークンがない場合はIDトークンの有効期限だけで判定
		if credentials.OidcRefreshToken == nil && idToken.Expiry.Before(time.Now()) {
			log.Error("IDToken is expired.")
			return false
		}
		// リフレッシュが必要なければtrueを返す
		if !isOidcAccessTokenRefresh(idToken.Expiry) {
			return true
		}
	} else {
		// errVerifyがTokenExpiredErrorの場合でリフレッシュトークンがある場合はリフレッシュ
		if _, ok := errVerify.(*oidc.TokenExpiredError); ok && credentials.OidcRefreshToken != nil {
			log.Info("The ID token expired, but I had a refresh token, so I refreshed it.")
		} else {
			log.Errorf("IDToken verify failed -> %v", errVerify)
			return false
		}
	}

	// ---- 以下リフレッシュトークンがある場合の処理 ----
	// リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
	config := getOidcOAuth2Config("", oidcConfig)
	token := &oauth2.Token{
		AccessToken:  *credentials.OidcAccessToken,
		TokenType:    *credentials.OidcTokenType,
		RefreshToken: *credentials.OidcRefreshToken,
		Expiry:       time.Unix(0, int64(*credentials.OidcExpiryDate)*int64(time.Millisecond)),
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
	credentials.OidcAccessToken = &newToken.AccessToken
	credentials.OidcTokenType = &newToken.TokenType
	credentials.OidcRefreshToken = &newToken.RefreshToken
	credentials.OidcIdToken = &rawIDToken
	expiry := uint64(newToken.Expiry.UnixNano() / int64(time.Millisecond))
	credentials.OidcExpiryDate = &expiry

	// 更新したクレデンシャルをDBに保存
	if err := domains.UpdateAdminUserByID(ctx, userID, credentials); err != nil {
		log.Errorf("UpdateAdminUser failed -> %v", err)
		return false
	}

	return true
}

func getOidcTokenVerifier(c *config.Oidc) (*oidc.IDTokenVerifier, *errors.VironError) {
	oidcConfig := &oidc.Config{
		ClientID: c.ClientID,
	}
	return oidcProvider.Verifier(oidcConfig), nil
}

func getOidcOAuth2Config(redirectUrl string, c *config.Oidc) *oauth2.Config {
	if oidcOAuth2Config != nil {
		return oidcOAuth2Config
	}
	scope := constant.OIDC_DEFAULT_SCOPES
	if len(c.AdditionalScope) > 0 {
		scope = append(constant.OIDC_DEFAULT_SCOPES, c.AdditionalScope...)
	}
	config := &oauth2.Config{
		ClientID:     c.ClientID,
		ClientSecret: c.ClientSecret,
		Endpoint:     oidcProvider.Endpoint(),
		Scopes:       scope,
		RedirectURL:  redirectUrl,
	}
	// redirectUrlが空以外の場合にキャッシュ
	if redirectUrl != "" {
		oidcOAuth2Config = config
	}
	return config
}

func isOidcAccessTokenRefresh(expiry time.Time) bool {
	// 有効期限の30秒前からリフレッシュ
	return expiry.Add(-constant.OIDC_REFRESH_THRESHOLD).Before(time.Now())
}
