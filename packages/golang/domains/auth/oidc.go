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
	oidc "github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

var (
	oidcConfig   *config.Oidc
	oidcProvider *oidc.Provider
	oauth2Config *oauth2.Config
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

func getOidcVerifier(c *config.Oidc) (*oidc.IDTokenVerifier, *errors.VironError) {
	oidcConfig := &oidc.Config{
		ClientID: c.ClientID,
	}
	return oidcProvider.Verifier(oidcConfig), nil
}

func getOAuth2Config(redirectUrl string, c *config.Oidc) *oauth2.Config {
	if oauth2Config != nil {
		return oauth2Config
	}
	scope := constant.OIDC_DEFAULT_SCOPES
	if len(c.AdditionalScope) > 0 {
		scope = append(constant.OIDC_DEFAULT_SCOPES, c.AdditionalScope...)
	}
	oauth2Config = &oauth2.Config{
		ClientID:     c.ClientID,
		ClientSecret: c.ClientSecret,
		Endpoint:     oidcProvider.Endpoint(),
		Scopes:       scope,
		RedirectURL:  redirectUrl,
	}
	return oauth2Config
}

func GetOidcAuthorizationUrl(redirectUrl string, state string) string {
	cfg := getOAuth2Config(redirectUrl, oidcConfig)
	return cfg.AuthCodeURL(state)
}

func SigninOidc(code string, redirectUrl string, r *http.Request) (string, *errors.VironError) {
	ctx := r.Context()

	// 設定取得
	config := getOAuth2Config(redirectUrl, oidcConfig)

	// 許可コードとトークンを交換
	oidcToken, errExchange := config.Exchange(ctx, code)
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
	verifier, err := getOidcVerifier(oidcConfig)

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
		log.Error("SigninOidc sign failed %#v \n", err)
		return "", errors.SigninFailed
	}
	return token, nil
}
