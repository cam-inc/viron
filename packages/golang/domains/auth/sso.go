package auth

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
)

type AuthSSO struct {
	authConfig *config.Auth
	oidc       *[]AuthOIDC
}

func NewSSO(c *config.Auth) *AuthSSO {
	var oidc []AuthOIDC
	for _, v := range c.SSO.OIDC {
		oidc = append(oidc, *newOIDC(&v))
	}

	return &AuthSSO{
		authConfig: c,
		oidc:       &oidc,
	}
}

// OIDC Code Verifier生成
func (as *AuthSSO) GenOIDCCodeVerifier(clientID string) string {
	authOIDC := as.getAuthOIDC(clientID)
	if authOIDC != nil {
		return authOIDC.genCodeVerifier()
	}
	return ""
}

// OIDC Authorization URL生成
func (as *AuthSSO) GetOIDCAuthorizationUrl(clientID string, redirectUrl string, codeVerifier string, state string) string {
	authOIDC := as.getAuthOIDC(clientID)
	if authOIDC != nil {
		return authOIDC.getAuthorizationUrl(redirectUrl, codeVerifier, state)
	}
	return ""
}

// OIDC Signin
func (as *AuthSSO) SigninOIDC(r *http.Request, clientID string, redirectUrl string, code string, state string, codeVerifier string) (string, *errors.VironError) {
	authOIDC := as.getAuthOIDC(clientID)
	if authOIDC != nil {
		return authOIDC.signinOIDC(r, redirectUrl, code, state, codeVerifier, as.authConfig.MultipleAuthUser)
	}
	log.Error("authOIDC is nil ", clientID)
	return "", errors.SigninFailed
}

// SSO Token Verify
func (as *AuthSSO) VerifyAccessToken(r *http.Request, clientID string, userID string, user domains.AdminUser) bool {
	ctx := r.Context()

	// SSOトークンを取得
	ssoToken := domains.FindSSOTokenByUserID(ctx, clientID, userID)
	// SSOトークンが存在しない場合はエラー
	if ssoToken == nil {
		log.Error("ssoToken not found")
		return false
	}

	// 認証タイプがoidcの場合はOIDCトークンを検証
	if ssoToken.AuthType == constant.AUTH_TYPE_OIDC {
		for _, v := range *as.oidc {
			if v.oidcConfig.ClientID == clientID {
				return v.verifyOidcAccessToken(r, userID, *ssoToken)
			}
		}
	}

	log.Info("authType is not oidc ", clientID)
	return true

}

// get Auth OIDC
func (as *AuthSSO) getAuthOIDC(clientID string) *AuthOIDC {
	for _, v := range *as.oidc {
		if v.oidcConfig.ClientID == clientID {
			return &v
		}
	}
	return nil
}
