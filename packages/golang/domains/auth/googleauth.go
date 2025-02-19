package auth

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googleOAuth2Config *config.GoogleOAuth2
	googleOidcProvider *oidc.Provider
	oauth2Config       *oauth2.Config
)

func NewGoogleOAuth2(googleOAuth2 *config.GoogleOAuth2) {
	googleOAuth2Config = googleOAuth2
	var err error
	googleOidcProvider, err = oidc.NewProvider(context.Background(), googleOAuth2.IssuerURL)
	if err != nil {
		log.Errorf("oidc.NewProvider failed -> %v", err)
		panic(err)
	}
}

func GetGoogleOAuth2AuthorizationUrl(redirectUrl string, state string) (string, *errors.VironError) {
	cfn := getOAuth2Config(redirectUrl, googleOAuth2Config)
	url := cfn.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
	return url, nil
}

func SigninGoogleOAuth2(code string, redirectUrl string, r *http.Request) (string, *errors.VironError) {
	ctx := r.Context()

	config := getOAuth2Config(redirectUrl, googleOAuth2Config)
	oauth2Token, errExchange := config.Exchange(ctx, code)
	if errExchange != nil {
		log.Errorf("Exchange failed -> %v", errExchange)
		return "", errors.SigninFailed
	}

	// IDトークンを取得
	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		log.Error("id_token not found")
		return "", errors.SigninFailed
	}

	// IDトークン検証機を取得
	verifier, errVerifier := getGoogleOAuth2TokenVerifier(googleOAuth2Config)
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

	user := domains.FindByEmail(ctx, claims.Email)
	if user == nil {
		expiry := uint64(oauth2Token.Expiry.UnixNano() / int64(time.Millisecond))
		payload := &domains.AdminUser{
			Email:                    claims.Email,
			GoogleOAuth2TokenType:    &oauth2Token.TokenType,
			GoogleOAuth2IdToken:      &rawIDToken,
			GoogleOAuth2AccessToken:  &oauth2Token.AccessToken,
			GoogleOAuth2RefreshToken: &oauth2Token.RefreshToken,
			GoogleOAuth2ExpiryDate:   &expiry,
			AuthType:                 constant.AUTH_TYPE_GOOGLE,
		}
		var err error
		user, err = createFirstAdminUser(ctx, payload, payload.AuthType)
		if err != nil {
			log.Errorf("create first admin user failed err:%v, user:%v", err, user)
			return "", errors.SigninFailed
		}

		if user == nil {
			if user, err = createViewer(ctx, payload, payload.AuthType); err != nil {
				log.Errorf("create admin user(viewer) failed err:%v, user:%v", err, user)
			}
		}
	}

	if user.AuthType != constant.AUTH_TYPE_GOOGLE {
		log.Error("user authType is not google.")
		return "", errors.SigninFailed
	}

	token, errSign := Sign(r, user.ID)
	if errSign != nil {
		log.Error("SigninGoogleOAuth2 sign failed %#v \n", errSign)
		return "", errors.SigninFailed
	}
	return token, nil
}

func VerifyGoogleOAuth2AccessToken(r *http.Request, userID string, credentials *domains.AdminUser) bool {
	// credentialsが不正の場合はエラー
	if credentials == nil ||
		credentials.GoogleOAuth2AccessToken == nil ||
		credentials.GoogleOAuth2ExpiryDate == nil ||
		credentials.GoogleOAuth2TokenType == nil ||
		credentials.GoogleOAuth2IdToken == nil ||
		credentials.GoogleOAuth2RefreshToken == nil {
		log.Errorf("credentials is invalid -> %+v", credentials)
		return false
	}

	ctx := r.Context()

	// IDトークンの検証
	// vironではIDトークンはDBに保存されているので、改竄されることはないが
	// DBはviron利用者が管理するため改竄されることを考慮してvironLibとしてはIDトークンの検証を毎度行う
	verifier, err := getGoogleOAuth2TokenVerifier(googleOAuth2Config)
	if err != nil {
		log.Errorf("getGoogleOAuth2TokenVerifier failed -> %v", err)
		return false
	}
	idToken, errVerify := verifier.Verify(ctx, *credentials.GoogleOAuth2IdToken)
	if errVerify == nil {
		// リフレッシュトークンがない場合はIDトークンの有効期限だけで判定
		if credentials.GoogleOAuth2RefreshToken == nil && idToken.Expiry.Before(time.Now()) {
			log.Error("IDToken is expired.")
			return false
		}
		// リフレッシュが必要なければtrueを返す
		if !isGoogleOAuth2AccessTokenRefresh(idToken.Expiry) {
			return true
		}
	} else {
		// errVerifyがTokenExpiredErrorの場合でリフレッシュトークンがある場合はリフレッシュ
		if _, ok := errVerify.(*oidc.TokenExpiredError); ok && credentials.GoogleOAuth2RefreshToken != nil {
			log.Info("The ID token expired, but I had a refresh token, so I refreshed it.")
		} else {
			log.Errorf("IDToken verify failed -> %v", errVerify)
			return false
		}
	}

	// ---- 以下リフレッシュトークンがある場合の処理 ----
	// リフレッシュトークンがある場合はリフレッシュトークンを使ってトークンを更新
	config := getOAuth2Config("", googleOAuth2Config)
	token := &oauth2.Token{
		AccessToken:  *credentials.GoogleOAuth2AccessToken,
		TokenType:    *credentials.GoogleOAuth2TokenType,
		RefreshToken: *credentials.GoogleOAuth2RefreshToken,
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
	credentials.GoogleOAuth2AccessToken = &newToken.AccessToken
	credentials.GoogleOAuth2TokenType = &newToken.TokenType
	credentials.GoogleOAuth2RefreshToken = &newToken.RefreshToken
	credentials.GoogleOAuth2IdToken = &rawIDToken
	expiry := uint64(newToken.Expiry.UnixNano() / int64(time.Millisecond))
	credentials.GoogleOAuth2ExpiryDate = &expiry

	// 更新したクレデンシャルをDBに保存
	if err := domains.UpdateAdminUserByID(ctx, userID, credentials); err != nil {
		log.Errorf("UpdateAdminUser failed -> %v", err)
		return false
	}

	return true
}

func getOAuth2Config(redirectUrl string, googleOAuth2 *config.GoogleOAuth2) *oauth2.Config {
	if oauth2Config != nil {
		return oauth2Config
	}
	scope := constant.GOOGLE_OAUTH2_DEFAULT_SCOPES
	if len(googleOAuth2.AdditionalScope) > 0 {
		scope = append(constant.GOOGLE_OAUTH2_DEFAULT_SCOPES, googleOAuth2.AdditionalScope...)
	}
	config := &oauth2.Config{
		ClientID:     googleOAuth2.ClientID,
		ClientSecret: googleOAuth2.ClientSecret,
		Endpoint:     google.Endpoint,
		Scopes:       scope,
		RedirectURL:  redirectUrl,
	}
	// redirectUrlが空以外の場合にキャッシュ
	if redirectUrl != "" {
		oauth2Config = config
	}
	return config
}

func getGoogleOAuth2TokenVerifier(c *config.GoogleOAuth2) (*oidc.IDTokenVerifier, *errors.VironError) {
	oidcConfig := &oidc.Config{
		ClientID: c.ClientID,
	}
	return googleOidcProvider.Verifier(oidcConfig), nil
}

func isGoogleOAuth2AccessTokenRefresh(expiry time.Time) bool {
	// 有効期限の30秒前からリフレッシュ
	return expiry.Add(-constant.GOOGLE_OAUTH2_REFRESH_THRESHOLD).Before(time.Now())
}
