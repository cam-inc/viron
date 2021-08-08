package helpers

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/constant"
)

func GenCookie(key string, value string, opts *http.Cookie) *http.Cookie {
	/*
		cookie := &http.Cookie{
			Name:     constant.ClientIDCookieName,
			Expires:  expires,
			Path:     "/",
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
	*/

	if opts.Path == "" {
		opts.Path = "/"
	}
	if opts.SameSite == http.SameSiteDefaultMode {
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

func GenAuthorizationCookie(token string, opts *http.Cookie) *http.Cookie {
	/*
		if (!opts.maxAge && !opts.expires) {
		    opts.maxAge = DEFAULT_JWT_EXPIRATION_SEC;
		  }
	*/

	if opts.MaxAge == 0 && opts.Expires.IsZero() {
		opts.MaxAge = constant.DEFAULT_JWT_EXPIRATION_SEC
	}
	return GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, token, opts)
}

/*
// Cookie文字列を生成
export const genCookie = (
  key: string,
  value: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (opts.httpOnly === undefined) {
    opts.httpOnly = true;
  }
  if (!opts.path) {
    opts.path = '/';
  }
  if (opts.secure === undefined) {
    opts.secure = true;
  }
  if (!opts.sameSite) {
    opts.sameSite = 'none';
  }
  return serialize(key, value, opts);
};

// 認証トークン用のCookie文字列を生成
export const genAuthorizationCookie = (
  token: string,
  options?: CookieSerializeOptions
): string => {
  const opts = Object.assign({}, options);
  if (!opts.maxAge && !opts.expires) {
    opts.maxAge = DEFAULT_JWT_EXPIRATION_SEC;
  }
  return genCookie(COOKIE_KEY.VIRON_AUTHORIZATION, token, opts);
};
*/
