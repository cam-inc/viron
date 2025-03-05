package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/cam-inc/viron/packages/golang/constant"
	pkgErrors "github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/repositories"
	"github.com/cam-inc/viron/packages/golang/repositories/container"
	"github.com/cam-inc/viron/packages/golang/repositories/mock"
	"github.com/stretchr/testify/assert"
)

// モックプロバイダ
func mockProvider(r *http.Request) (string, []string, error) {
	return "test-issuer", []string{"test-audience"}, nil
}

// プロバイダがエラーを返すモック
func mockErrorProvider(r *http.Request) (string, []string, error) {
	return "", nil, errors.New("provider error")
}

// RevokedTokenが見つかる場合のモック
func mockRevokedTokenFindOne(token string) {
	revokedTokenEntity := &repositories.RevokedTokenEntity{
		ID:        "0",
		Token:     token,
		RevokedAt: time.Time{},
		CreatedAt: time.Time{},
		UpdatedAt: time.Time{},
	}
	f := mock.MockFunc{
		FindOne: func(ctx context.Context, s string) (repositories.Entity, error) {
			return revokedTokenEntity, nil
		},
	}
	if err := container.SetUpMock(map[string]mock.MockFunc{
		"revokedtokens": f,
	}); err != nil {
		panic(err)
	}
}

// RevokedTokenが見つからない場合のモック
func mockRevokedTokenFindOneNotFound() {
	f := mock.MockFunc{
		FindOne: func(ctx context.Context, s string) (repositories.Entity, error) {
			return nil, errors.New("not found")
		},
	}
	if err := container.SetUpMock(map[string]mock.MockFunc{
		"revokedtokens": f,
	}); err != nil {
		panic(err)
	}
}

// TestSetUpJWT JWTの初期化テスト
func TestSetUpJWT(t *testing.T) {
	err := SetUpJWT("secret-key", mockProvider, 3600)
	assert.NoError(t, err)
	assert.NotNil(t, jwt)
}

// TestSignAndVerify JWTのSignとVerifyのテスト
func TestSignAndVerify(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	token, err := Sign(req, "test-subject")
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	token = token[len(constant.AUTH_SCHEME)+1:]

	// mock
	mockRevokedTokenFindOneNotFound()

	claim, err := Verify(req, token)
	assert.NoError(t, err)
	assert.NotNil(t, claim)
	assert.Equal(t, "test-subject", claim.Sub)
}

// TestSign_ErrorProvider JWTのSignのエラーテスト
func TestSign_ErrorProvider(t *testing.T) {
	if err := SetUpJWT("secret-key", mockErrorProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	_, err := Sign(req, "test-subject")
	assert.Error(t, err)
	assert.Equal(t, "provider error", err.Error())
}

// TestVerify_ErrorToken JWTのVerifyのエラーテスト
func TestVerify_ErrorToken(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	_, err := Verify(req, "invalid.token.string")
	assert.Error(t, err)
}

// TestVerify_RevokedToken JWTのVerifyのuninitializedのテスト
func TestVerify_JwtUninitialized(t *testing.T) {
	jwt = nil
	req := httptest.NewRequest("GET", "/", nil)

	_, err := Verify(req, "some-valid-token")
	assert.Error(t, err)
	assert.Equal(t, pkgErrors.JwtUninitialized.Error(), err.Error())
}

// TestVerify_RevokedToken JWTのVerifyのsigned out tokenのテスト
func TestVerify_SignedOutToken(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	token, _ := Sign(req, "test-subject")
	token = token[len(constant.AUTH_SCHEME)+1:]

	// mock
	mockRevokedTokenFindOne(token)

	_, err := Verify(req, token)
	assert.Error(t, err)
	assert.Equal(t, fmt.Errorf("this token is revoked %s", token).Error(), err.Error())
}

// TestVerify_IssuerMismatch JWTのVerifyのissuer mismatchのテスト
func TestVerify_IssuerMismatch(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	token, _ := Sign(req, "test-subject")
	token = token[len(constant.AUTH_SCHEME)+1:]

	// 別のリクエストで比較
	reqDiff := httptest.NewRequest("GET", "/", nil)
	mockDiffProvider := func(r *http.Request) (string, []string, error) {
		return "different-issuer", []string{"test-audience"}, nil
	}

	jwt.Provider = mockDiffProvider

	// mock
	mockRevokedTokenFindOneNotFound()

	_, err := Verify(reqDiff, token)
	assert.Error(t, err)
	assert.Equal(t, fmt.Errorf("iss miss match verify iss[%s] jwt iss[%s]", "different-issuer", "test-issuer").Error(), err.Error())
}

// TestVerify_AudienceMismatch JWTのVerifyのaudience mismatchのテスト
func TestVerify_AudienceMismatch(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	token, _ := Sign(req, "test-subject")
	token = token[len(constant.AUTH_SCHEME)+1:]

	// 別のリクエストで異なるオーディエンスで比較
	reqDiff := httptest.NewRequest("GET", "/", nil)
	mockDiffProvider := func(r *http.Request) (string, []string, error) {
		return "test-issuer", []string{"wrong-audience"}, nil
	}

	jwt.Provider = mockDiffProvider

	// mock
	mockRevokedTokenFindOneNotFound()

	_, err := Verify(reqDiff, token)
	assert.Error(t, err)
	assert.Equal(t, fmt.Errorf("aud miss match verify aud[%s] jwt aud[%s]", "[wrong-audience]", "[test-audience]").Error(), err.Error())
}

// TestCheckAudience オーディエンスのチェックテスト
func TestCheckAudience(t *testing.T) {
	assert.True(t, checkAudience([]string{"aud1", "aud2"}, []string{"aud2"}))
	assert.False(t, checkAudience([]string{"aud1"}, []string{"aud3"}))
	assert.False(t, checkAudience([]string{}, []string{}))
}

// TestSign_InvalidJWT JWTのSignのエラーテスト
func TestSign_InvalidJWT(t *testing.T) {
	if err := SetUpJWT("secret-key", mockErrorProvider, 3600); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	_, err := Sign(req, "")
	assert.Error(t, err)
	assert.Equal(t, "provider error", err.Error())
}

// TestVerify_ExpiredToken JWTのVerifyの有効期限切れのテスト
func TestVerify_ExpiredToken(t *testing.T) {
	if err := SetUpJWT("secret-key", mockProvider, -1); err != nil {
		panic(err)
	}
	req := httptest.NewRequest("GET", "/", nil)

	token, _ := Sign(req, "test-subject")
	token = token[len(constant.AUTH_SCHEME)+1:]

	// mock
	mockRevokedTokenFindOneNotFound()

	_, err := Verify(req, token)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "token is expired")
}
