package auth

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"
)

type authObj struct {
}

/*
/*
// サインアウト
export const signout = async (context: RouteContext): Promise<void> => {
  const token = context.req.cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
  context.origRes.clearCookie(COOKIE_KEY.VIRON_AUTHORIZATION);
  await domainsAuth.signout(token);
  context.res.status(204).end();
};



// GoogleOAuth2の認可画面へリダイレクト
export const oauth2GoogleAuthorization = async (
  context: RouteContext
): Promise<void> => {
  const { redirectUri } = context.params.query;
  const state = domainsAuth.genState();

  const authorizationUrl = domainsAuth.getGoogleOAuth2AuthorizationUrl(
    redirectUri,
    state,
    ctx.config.auth.googleOAuth2
  );

  context.res.setHeader(HTTP_HEADER.SET_COOKIE, genOAuthStateCookie(state));
  context.res.setHeader(HTTP_HEADER.LOCATION, authorizationUrl);
  context.res.status(301).end();
};

// GoogleOAuth2のコールバック
export const oauth2GoogleCallback = async (
  context: RouteContext
): Promise<void> => {
  const cookieState = context.req.cookies[COOKIE_KEY.OAUTH2_STATE];
  const { code, state, redirectUri } = context.requestBody;

  if (!cookieState || !state || cookieState !== state) {
    throw mismatchState();
  }

  const token = await domainsAuth.signinGoogleOAuth2(
    code,
    redirectUri,
    ctx.config.auth.googleOAuth2
  );
  context.res.setHeader(
    HTTP_HEADER.SET_COOKIE,
    genAuthorizationCookie(token, {
      maxAge: ctx.config.auth.jwt.expirationSec,
    })
  );
  context.res.status(204).end();
};

*/

// SigninEmail emailサインイン
func (a *authObj) SigninEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	signinEmail := &SigninEmailPayload{}
	if err := helpers.BodyDecode(r, signinEmail); err != nil {
		helpers.SendError(w, http.StatusBadRequest, err)
		return
	}

	if signinEmail == nil {
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	token, err := auth.SigninEmail(ctx, string(signinEmail.Email), signinEmail.Password)
	if err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}

	v := ctx.Value(constant.CTX_KEY_JWT_EXPIRATION_SEC)
	var age int
	if v != nil {
		age, _ = v.(int)
	}
	opts := &http.Cookie{
		MaxAge:   age,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   r.URL.Hostname(),
	}
	cookie := helpers.GenAuthorizationCookie(token, opts)
	http.SetCookie(w, cookie)
	w.WriteHeader(http.StatusNoContent)
}

func (a *authObj) Oauth2GoogleAuthorization(w http.ResponseWriter, r *http.Request, params Oauth2GoogleAuthorizationParams) {
	panic("implement me")
}

func (a *authObj) Oauth2GoogleCallback(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (a *authObj) Signout(w http.ResponseWriter, r *http.Request) {
	token, _ := helpers.GetCookieToken(r)
	if token == "" {
		helpers.Send(w, http.StatusNoContent, nil)
	}

	if !auth.SignOut(r.Context(), token) {
		logging.GetDefaultLogger().Warn("signount failed.")
	}

	cookie := helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   r.URL.Hostname(),
	})
	http.SetCookie(w, cookie)
	helpers.Send(w, http.StatusNoContent, nil)
}

func (a *authObj) LoadOas() *openapi3.T {
	oas, _ := GetSwagger()
	return oas
}

func New() ServerInterface {
	return &authObj{}
}
