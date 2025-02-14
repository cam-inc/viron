package helpers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/cam-inc/viron/packages/golang/constant"
)

// GenCookie cookie生成
func GenCookie(key string, value string, opts *http.Cookie) *http.Cookie {

	if opts == nil {
		opts = &http.Cookie{}
	}

	if opts.Path == "" {
		opts.Path = "/"
	}
	if opts.SameSite == http.SameSiteDefaultMode || opts.SameSite == 0 {
		opts.SameSite = http.SameSiteNoneMode
	}

	return &http.Cookie{
		Name:     key,
		Value:    value,
		Domain:   opts.Domain,
		HttpOnly: opts.HttpOnly,
		Expires:  opts.Expires,
		MaxAge:   opts.MaxAge,
		Path:     opts.Path,
		SameSite: opts.SameSite,
		Secure:   opts.Secure,
	}
}

// GenAuthorizationCookie 認証cookie生成
func GenAuthorizationCookie(token string, opts *http.Cookie) *http.Cookie {
	if opts.MaxAge == 0 && opts.Expires.IsZero() {
		opts.MaxAge = constant.DEFAULT_JWT_EXPIRATION_SEC
	}
	return GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, token, opts)
}

// GenOAuthStateCookie cookie生成
func GenOAuthStateCookie(state string, opts *http.Cookie) *http.Cookie {
	if opts.MaxAge == 0 && opts.Expires.IsZero() {
		opts.MaxAge = constant.OAUTH2_STATE_EXPIRATION_SEC
	}
	return GenCookie(constant.COOKIE_KEY_OAUTH2_STATE, state, opts)
}

// GenOidcStateCookie cookie生成
func GenOidcStateCookie(state string, opts *http.Cookie) *http.Cookie {
	if opts.MaxAge == 0 && opts.Expires.IsZero() {
		opts.MaxAge = constant.OIDC_STATE_EXPIRATION_SEC
	}
	return GenCookie(constant.COOKIE_KEY_OIDC_STATE, state, opts)
}

// GetCookieToken cookieから認証token取得
func GetCookieToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION)
	if err != nil {
		return "", err
	}

	if cookie == nil {
		return "", fmt.Errorf("cookie notfound")
	}

	tokens := strings.Split(cookie.Value, " ")
	if len(tokens) != 2 || tokens[0] != constant.AUTH_SCHEME {
		return "", fmt.Errorf("token invalid")
	}

	return tokens[1], nil

}
