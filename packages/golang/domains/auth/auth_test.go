package auth

import (
	"context"
	"fmt"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/container"
	"github.com/cam-inc/viron/packages/golang/repositories/mock"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/stretchr/testify/assert"
	"golang.org/x/oauth2"
)

// MockOIDCProviderFactory モックのOIDCプロバイダファクトリ
type MockOIDCProviderFactory struct{}

func (m *MockOIDCProviderFactory) NewProvider(ctx context.Context, issuer string) *oidc.Provider {
	return &oidc.Provider{}
}

// MockOIDCProvider モックのOIDCプロバイダ
type MockOIDCProvider struct{}

func (m *MockOIDCProvider) Verifier(config *oidc.Config) *oidc.IDTokenVerifier {
	return &oidc.IDTokenVerifier{}
}

func (m *MockOIDCProvider) Endpoint() oauth2.Endpoint {
	return oauth2.Endpoint{}
}

// MockOAuthProvider モックのOAuthプロバイダ
type MockOAuthProvider struct{}

func (m *MockOAuthProvider) AuthCodeURL(state string, opts ...oauth2.AuthCodeOption) string {
	return "http://example.com/auth"
}

func (m *MockOAuthProvider) Exchange(ctx context.Context, code string, opts ...oauth2.AuthCodeOption) (*oauth2.Token, error) {
	return &oauth2.Token{}, nil
}

func (m *MockOAuthProvider) TokenSource(ctx context.Context, token *oauth2.Token) oauth2.TokenSource {
	return oauth2.StaticTokenSource(token)
}

// AdminUserSSOTokenが見つかる場合のモック
func mockAdminUserSSOTokenFind(userID string) {
	ssoTokenEntiry := &repositories.AdminUserSSOTokenEntity{
		ID:           "0",
		UserID:       userID,
		Provider:     "provider",
		ClientID:     "client-id",
		AuthType:     constant.AUTH_TYPE_OIDC,
		IdToken:      "id-token",
		AccessToken:  "access-token",
		RefreshToken: nil,
		ExpiryDate:   0,
		TokenType:    "token-type",
		CreatedAt:    time.Time{},
		UpdatedAt:    time.Time{},
	}
	f := mock.MockFunc{
		Find: func(context.Context, repositories.Conditions) (repositories.EntitySlice, error) {
			fmt.Printf("find ssoTokenEntiry: %v\n", ssoTokenEntiry)
			return repositories.EntitySlice{ssoTokenEntiry}, nil
		},
	}
	if err := container.SetUpMock(map[string]mock.MockFunc{
		"adminuserssotokens": f,
	}); err != nil {
		panic(err)
	}
}

func TestNewAuth(t *testing.T) {
	multipleAuthUser := true
	googleConfig := &config.GoogleOAuth2{
		ClientID:     "google-client-id",
		ClientSecret: "google-client-secret",
		IssuerURL:    "https://accounts.google.com",
	}
	oidcConfig := &config.OIDC{
		ClientID:     "oidc-client-id",
		ClientSecret: "oidc-client-secret",
		IssuerURL:    "https://oidc-provider.com",
	}

	providerFactory := &MockOIDCProviderFactory{}
	auth := New(&multipleAuthUser, googleConfig, oidcConfig, providerFactory)
	assert.NotNil(t, auth)
	assert.True(t, auth.multipleAuthUser)
	assert.NotNil(t, auth.authGoogleOAuth2)
	assert.NotNil(t, auth.authOIDC)
}

func TestGenGoogleOAuth2CodeVerifier(t *testing.T) {
	googleConfig := &config.GoogleOAuth2{
		ClientID:     "google-client-id",
		ClientSecret: "google-client-secret",
		IssuerURL:    "https://accounts.google.com",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, googleConfig, nil, providerFactory)

	codeVerifier := auth.GenGoogleOAuth2CodeVerifier("google-client-id")
	assert.NotEmpty(t, codeVerifier)
}

func TestGenGoogleOAuth2AuthorizationUrl(t *testing.T) {
	googleConfig := &config.GoogleOAuth2{
		ClientID:     "google-client-id",
		ClientSecret: "google-client-secret",
		IssuerURL:    "https://accounts.google.com",
		RedirectURL:  "https://redirect.url",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, googleConfig, nil, providerFactory)

	url := auth.GenGoogleOAuth2AuthorizationUrl("google-client-id", "https://redirect.url", "code-verifier", "state")
	assert.NotEmpty(t, url)
}

func TestSigninGoogleOAuth2(t *testing.T) {
	googleConfig := &config.GoogleOAuth2{
		ClientID:     "google-client-id",
		ClientSecret: "google-client-secret",
		IssuerURL:    "https://accounts.google.com",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, googleConfig, nil, providerFactory)

	req := httptest.NewRequest("POST", "/", nil)
	token, err := auth.SigninGoogleOAuth2(req, "google-client-id", "https://redirect.url", "code", "state", "code-verifier")
	assert.Empty(t, token)
	assert.NotNil(t, err)
}

func TestGenOIDCCodeVerifier(t *testing.T) {
	oidcConfig := &config.OIDC{
		ClientID:     "oidc-client-id",
		ClientSecret: "oidc-client-secret",
		IssuerURL:    "https://oidc-provider.com",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, nil, oidcConfig, providerFactory)

	codeVerifier := auth.GenOIDCCodeVerifier("oidc-client-id")
	assert.NotEmpty(t, codeVerifier)
}

func TestGenOIDCAuthorizationUrl(t *testing.T) {
	oidcConfig := &config.OIDC{
		ClientID:     "oidc-client-id",
		ClientSecret: "oidc-client-secret",
		IssuerURL:    "https://oidc-provider.com",
		RedirectURL:  "https://redirect.url",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, nil, oidcConfig, providerFactory)

	url := auth.GenOIDCAuthorizationUrl("oidc-client-id", "https://redirect.url", "code-verifier", "state")
	assert.NotEmpty(t, url)
}

func TestSigninOIDC(t *testing.T) {
	oidcConfig := &config.OIDC{
		ClientID:     "oidc-client-id",
		ClientSecret: "oidc-client-secret",
		IssuerURL:    "https://oidc-provider.com",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, nil, oidcConfig, providerFactory)

	req := httptest.NewRequest("POST", "/", nil)
	token, err := auth.SigninOIDC(req, "oidc-client-id", "https://redirect.url", "code", "state", "code-verifier")
	assert.Empty(t, token)
	assert.NotNil(t, err)
}

func TestVerifyAccessToken(t *testing.T) {
	oidcConfig := &config.OIDC{
		ClientID:     "oidc-client-id",
		ClientSecret: "oidc-client-secret",
		IssuerURL:    "https://oidc-provider.com",
	}
	providerFactory := &MockOIDCProviderFactory{}
	auth := New(nil, nil, oidcConfig, providerFactory)

	req := httptest.NewRequest("GET", "/", nil)
	user := domains.AdminUser{ID: "user-id"}

	// mock
	mockAdminUserSSOTokenFind(user.ID)

	valid := auth.VerifyAccessToken(req, "oidc-client-id", "user-id", user)
	assert.False(t, valid)
}
