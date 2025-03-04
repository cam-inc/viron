package auth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
)

type Auth struct {
	multipleAuthUser       bool
	authGoogleOAuth2Config *config.GoogleOAuth2
	authGoogleOAuth2       *AuthOIDC
	authOIDCConfig         *config.OIDC
	authOIDC               *AuthOIDC
}

// New Auth初期化
func New(multipleAuthUser *bool, google *config.GoogleOAuth2, oidc *config.OIDC) *Auth {
	fmt.Printf("multipleAuthUser: %v, google: %v, oidc: %v\n", multipleAuthUser, google, oidc)

	var googleConfig *config.OIDC
	if google != nil {
		// googleOAuth2は実質OIDCと同じなのでOIDCの実装を使い、isGoogleで拡張処理を行う
		googleConfig = &config.OIDC{
			ClientID:          google.ClientID,
			ClientSecret:      google.ClientSecret,
			IssuerURL:         google.IssuerURL,
			AdditionalScope:   google.AdditionalScope,
			UserHostedDomains: google.UserHostedDomains,
		}
	}

	return &Auth{
		multipleAuthUser:       multipleAuthUser != nil && *multipleAuthUser,
		authGoogleOAuth2Config: google,
		authOIDCConfig:         oidc,
		authGoogleOAuth2:       newOIDC(googleConfig),
		authOIDC:               newOIDC(oidc),
	}
}

// ---GoogleOAuth2---

// isGoogleOAuth2ClientID GoogleOAuth2のClientIDが一致しているか
func (a *Auth) isGoogleOAuth2ClientID(clientID string) bool {
	return a.authGoogleOAuth2 != nil && a.authGoogleOAuth2.oidcConfig.ClientID == clientID && a.authGoogleOAuth2Config.ClientID == clientID
}

// GenGoogleOAuth2CodeVerifier Code Verifier生成
func (a *Auth) GenGoogleOAuth2CodeVerifier(clientID string) string {
	if a.isGoogleOAuth2ClientID(clientID) {
		return a.authGoogleOAuth2.genCodeVerifier()
	}
	log.Error("authGoogleOAuth2 is nil ", clientID)
	return ""
}

// GenGoogleOAuth2AuthorizationUrlIDC Authorization URL生成
func (a *Auth) GenGoogleOAuth2AuthorizationUrl(clientID string, redirectUrl string, codeVerifier string, state string) string {
	if a.isGoogleOAuth2ClientID(clientID) {
		return a.authGoogleOAuth2.genAuthorizationUrl(redirectUrl, codeVerifier, state)
	}
	log.Error("authGoogleOAuth2 is nil ", clientID)
	return ""
}

// SigninGoogleOAuth2
func (a *Auth) SigninGoogleOAuth2(r *http.Request, clientID string, redirectUrl string, code string, state string, codeVerifier string) (string, *errors.VironError) {
	if a.isGoogleOAuth2ClientID(clientID) {
		return a.authGoogleOAuth2.signin(r, redirectUrl, code, state, codeVerifier, a.multipleAuthUser)
	}
	log.Error("authGoogleOAuth2 is nil ", clientID)
	return "", errors.SigninFailed
}

// ---OIDC---

// isOIDCClientID OIDCのClientIDが一致しているか
func (a *Auth) isOIDCClientID(clientID string) bool {
	return a.authOIDC != nil && a.authOIDC.oidcConfig.ClientID == clientID && a.authOIDCConfig.ClientID == clientID
}

// GenOIDCCodeVerifier Code Verifier生成
func (a *Auth) GenOIDCCodeVerifier(clientID string) string {
	if a.isOIDCClientID(clientID) {
		return a.authOIDC.genCodeVerifier()
	}
	log.Error("authOIDC is nil ", clientID)
	return ""
}

// GenOIDCAuthorizationUrl Authorization URL生成
func (a *Auth) GenOIDCAuthorizationUrl(clientID string, redirectUrl string, codeVerifier string, state string) string {
	if a.isOIDCClientID(clientID) {
		return a.authOIDC.genAuthorizationUrl(redirectUrl, codeVerifier, state)
	}
	log.Error("authOIDC is nil ", clientID)
	return ""
}

// SigninOIDC
func (a *Auth) SigninOIDC(r *http.Request, clientID string, redirectUrl string, code string, state string, codeVerifier string) (string, *errors.VironError) {
	if a.authOIDC != nil && a.authOIDCConfig.ClientID == clientID {
		return a.authOIDC.signin(r, redirectUrl, code, state, codeVerifier, a.multipleAuthUser)
	}
	log.Error("authOIDC is nil ", clientID)
	return "", errors.SigninFailed
}

// ---OIDC or GoogleOAuth2---

// VerifyAccessToken SSOトークン検証
func (a *Auth) VerifyAccessToken(r *http.Request, clientID string, userID string, user domains.AdminUser) bool {
	ctx := r.Context()

	// SSOトークンを取得
	ssoToken := domains.FindSSOTokenByUserID(ctx, clientID, userID)
	// SSOトークンが存在しない場合はエラー password認証の場合はこのメソッドは呼ばれない
	if ssoToken == nil {
		log.Error("ssoToken not found")
		return false
	}

	// 認証タイプがoidcの場合はOIDCトークンを検証
	if ssoToken.AuthType == constant.AUTH_TYPE_OIDC {
		if a.authOIDCConfig.ClientID == clientID {
			return a.authOIDC.verifyAccessToken(r, userID, *ssoToken)
		}
	}

	log.Info("authType is not oidc ", clientID)
	return true

}

// 以下 パッケージ関数
func createFirstAdminUser(ctx context.Context, user *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	if domains.CountAdminUser(ctx) != 0 {
		return nil, nil, nil
	}
	return createAdminUser(ctx, user, ssoToken, authType, constant.ADMIN_ROLE_SUPER)
}

func createViewer(ctx context.Context, user *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	return createAdminUser(ctx, user, ssoToken, authType, constant.ADMIN_ROLE_VIEWER)
}

func createAdminUser(ctx context.Context, payload *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string, roleID string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	user, err := domains.CreateAdminUser(ctx, payload, authType)
	if err != nil {
		return nil, nil, err
	}
	if authType == constant.AUTH_TYPE_OIDC {
		ssoToken.UserID = user.ID
		ssoToken, err = domains.CreateAdminUserSSOToken(ctx, ssoToken, authType)
		if err != nil {
			return user, nil, err
		}
	}
	if ret := domains.AddRoleForUser(user.ID, roleID); !ret {
		return user, ssoToken, fmt.Errorf("AddRoleForUser return %v", ret)
	}
	return user, ssoToken, nil
}
