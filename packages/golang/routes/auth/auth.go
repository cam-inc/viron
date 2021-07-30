package auth

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"
)

type authObj struct {
}

func sendError(w http.ResponseWriter, code int, err error) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(err)
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

func (a *authObj) SigninEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	/*
		export const signinEmail = async (context: RouteContext): Promise<void> => {
		  const { email, password } = context.requestBody;
		  const token = await domainsAuth.signinEmail(email, password);
		  context.res.setHeader(
		    HTTP_HEADER.SET_COOKIE,
		    genAuthorizationCookie(token, { maxAge: ctx.config.auth.jwt.expirationSec })
		  );
		  context.res.status(204).end();
		};
	*/

	signinEmail := &SigninEmailPayload{}
	if err := json.NewDecoder(r.Body).Decode(signinEmail); err != nil {
		fmt.Println("DEBUG JSON DECODE FAILED")
		sendError(w, http.StatusBadRequest, err)
		return
	}

	if signinEmail == nil {
		fmt.Println("DEBUG signin email failed")
		sendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	fmt.Printf("DEBUG:%v\n", signinEmail.Email)

	token, err := auth.SigninEmail(ctx, string(signinEmail.Email), signinEmail.Password)
	if err != nil {
		sendError(w, err.StatusCode(), err)
		return
	}
	v := ctx.Value(constant.CTX_KEY_JWT_EXPIRATION_SEC)
	var age int
	if v != nil {
		age, _ = v.(int)
	}
	opts := &http.Cookie{
		MaxAge: age,
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
	panic("implement me")
}

func (a *authObj) LoadOas() *openapi3.T {
	oas, _ := GetSwagger()
	return oas
}

func New() ServerInterface {
	return &authObj{}
}
