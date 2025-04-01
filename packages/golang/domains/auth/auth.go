package auth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

var (
	log logging.Logger
)

// OIDCProviderFactory は OIDC のプロバイダーを作成するためのインターフェース
type OIDCProviderFactory interface {
	NewProvider(ctx context.Context, issuer string) *oidc.Provider
}

// OIDCProviderFactoryImpl は本番環境用の実装
type OIDCProviderFactoryImpl struct{}

// NewProvider は実際の oidc.NewProvider を呼び出す
func (f *OIDCProviderFactoryImpl) NewProvider(ctx context.Context, issuer string) *oidc.Provider {
	oidcProvider, err := oidc.NewProvider(ctx, issuer)
	if err != nil {
		log.Errorf("oidc.NewProvider failed -> %v", err)
		panic(err)
	}
	return oidcProvider
}

type Auth struct {
	multipleAuthUser       bool
	authGoogleOAuth2Config *config.GoogleOAuth2
	authGoogleOAuth2       *AuthOIDC
	authOIDCConfig         *config.OIDC
	authOIDC               *AuthOIDC
}

// New Auth初期化
func New(multipleAuthUser *bool, google *config.GoogleOAuth2, oidcConfig *config.OIDC, providerFactory OIDCProviderFactory) *Auth {
	log = logging.GetDefaultLogger()

	var googleOIDC *AuthOIDC
	var customOIDC *AuthOIDC

	// providerFactoryがnilの場合はデフォルトの実装を使う
	if providerFactory == nil {
		providerFactory = &OIDCProviderFactoryImpl{}
	}

	if google != nil {
		// googleOAuth2は実質OIDCと同じなのでOIDCの実装を使い、isGoogleで拡張処理を行う
		googleConfig := &config.OIDC{
			ClientID:          google.ClientID,
			ClientSecret:      google.ClientSecret,
			IssuerURL:         google.IssuerURL,
			AdditionalScope:   google.AdditionalScope,
			UserHostedDomains: google.UserHostedDomains,
			RedirectURL:       google.RedirectURL,
		}
		// OIDCProviderの生成
		oidcProvider := providerFactory.NewProvider(context.Background(), googleConfig.IssuerURL)
		oidcProviderImpl := &OIDCProviderImpl{oidcProvider}
		// OAuthProviderの生成
		scope := constant.GOOGLE_OAUTH2_DEFAULT_SCOPES
		if len(googleConfig.AdditionalScope) > 0 {
			scope = append(scope, googleConfig.AdditionalScope...)
		}
		oauthProviderImpl := &OAuthProviderImpl{oauth2.Config{
			ClientID:     googleConfig.ClientID,
			ClientSecret: googleConfig.ClientSecret,
			Endpoint:     oidcProvider.Endpoint(),
			Scopes:       scope,
			RedirectURL:  googleConfig.RedirectURL,
		}}
		googleOIDC = newOIDC(*googleConfig, oidcProviderImpl, oauthProviderImpl)
	}

	if oidcConfig != nil {
		// OIDCProviderの生成
		oidcProvider := providerFactory.NewProvider(context.Background(), oidcConfig.IssuerURL)
		oidcProviderImpl := &OIDCProviderImpl{oidcProvider}
		// OAuthProviderの生成
		scope := constant.OIDC_DEFAULT_SCOPES
		if len(oidcConfig.AdditionalScope) > 0 {
			scope = append(scope, oidcConfig.AdditionalScope...)
		}
		oauthProviderImpl := &OAuthProviderImpl{oauth2.Config{
			ClientID:     oidcConfig.ClientID,
			ClientSecret: oidcConfig.ClientSecret,
			Endpoint:     oidcProvider.Endpoint(),
			Scopes:       scope,
			RedirectURL:  oidcConfig.RedirectURL,
		}}
		customOIDC = newOIDC(*oidcConfig, oidcProviderImpl, oauthProviderImpl)
	}

	return &Auth{
		multipleAuthUser:       multipleAuthUser != nil && *multipleAuthUser,
		authGoogleOAuth2Config: google,
		authOIDCConfig:         oidcConfig,
		authGoogleOAuth2:       googleOIDC,
		authOIDC:               customOIDC,
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
	if a.isGoogleOAuth2ClientID(clientID) && a.authGoogleOAuth2Config.RedirectURL == redirectUrl {
		return a.authGoogleOAuth2.genAuthorizationUrl(codeVerifier, state)
	}
	log.Error("authGoogleOAuth2 is nil ", clientID)
	return ""
}

// SigninGoogleOAuth2
func (a *Auth) SigninGoogleOAuth2(r *http.Request, clientID string, redirectUrl string, code string, state string, codeVerifier string) (string, *errors.VironError) {
	if a.isGoogleOAuth2ClientID(clientID) && a.authGoogleOAuth2Config.RedirectURL == redirectUrl {
		return a.authGoogleOAuth2.signin(r, code, state, codeVerifier, a.multipleAuthUser)
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
	if a.isOIDCClientID(clientID) && a.authOIDCConfig.RedirectURL == redirectUrl {
		return a.authOIDC.genAuthorizationUrl(codeVerifier, state)
	}
	log.Error("authOIDC is nil ", clientID)
	return ""
}

// SigninOIDC
func (a *Auth) SigninOIDC(r *http.Request, clientID string, redirectUrl string, code string, state string, codeVerifier string) (string, *errors.VironError) {
	if a.isOIDCClientID(clientID) && a.authOIDCConfig.RedirectURL == redirectUrl {
		return a.authOIDC.signin(r, code, state, codeVerifier, a.multipleAuthUser)
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
		switch ssoToken.Provider {
		// SSO認証プロバイダーがcustom場合はOIDCトークンを検証
		case constant.AUTH_SSO_IDPROVIDER_CUSTOM:
			if a.authOIDCConfig.ClientID == clientID {
				return a.authOIDC.verifyAccessToken(r, userID, *ssoToken)
			}
		// SSO認証プロバイダーがgoogleの場合はGoogleOAuth2トークンを検証
		case constant.AUTH_SSO_IDPROVIDER_GOOGLE:
			if a.authGoogleOAuth2Config.ClientID == clientID {
				return a.authGoogleOAuth2.verifyAccessToken(r, userID, *ssoToken)
			}
		}
	}

	log.Info("authType is not oidc ", clientID)
	return false
}

// 以下 パッケージ関数
func createFirstAdminUser(ctx context.Context, user *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	if domains.CountAdminUser(ctx) != 0 {
		return nil, ssoToken, nil
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
