package auth

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains/auth"
	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/google/uuid"
)

type authObj struct {
	log logging.Logger
}

// SigninEmail emailサインイン
func (a *authObj) SigninEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	signinEmail := &SigninEmailPayload{}
	if err := helpers.BodyDecode(r, signinEmail); err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, err)
		return
	}

	if signinEmail.Email == "" || signinEmail.Password == "" {
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	token, err := auth.SigninEmail(r, string(signinEmail.Email), signinEmail.Password)
	if err != nil {
		a.log.Errorf("%v", err)
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
	state, err := uuid.NewUUID()
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}
	url, errAuthUrl := auth.GetGoogleOAuth2AuthorizationUrl(string(params.RedirectUri), state.String())
	if errAuthUrl != nil {
		a.log.Errorf("%v", err)
	}
	ctx := r.Context()
	v := ctx.Value(constant.CTX_KEY_STATE_EXPIRATION_SEC)
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
	cookie := helpers.GenOAuthStateCookie(state.String(), opts)
	http.SetCookie(w, cookie)
	w.Header().Add("location", url)
	helpers.Send(w, http.StatusFound, nil)
}

func (a *authObj) Oauth2GoogleCallback(w http.ResponseWriter, r *http.Request) {
	state, err := r.Cookie(constant.COOKIE_KEY_OAUTH2_STATE)

	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}
	oauth2GoogleCollback := &OAuth2GoogleCallbackPayload{}
	if err := helpers.BodyDecode(r, oauth2GoogleCollback); err != nil {
		a.log.Errorf("body decode failed -> %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	if oauth2GoogleCollback == nil || state == nil || oauth2GoogleCollback.State != state.Value {
		a.log.Error(errors.MismatchState)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	ctx := r.Context()
	token, tokenErr := auth.SigninGoogleOAuth2(oauth2GoogleCollback.Code, oauth2GoogleCollback.RedirectUri, r)
	if tokenErr != nil {
		a.log.Errorf("tokenErr %v", tokenErr)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
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
	helpers.Send(w, http.StatusNoContent, nil)
}

func (a *authObj) OidcAuthorization(w http.ResponseWriter, r *http.Request, params OidcAuthorizationParams) {
	state, err := uuid.NewUUID()
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}
	url := auth.GetOidcAuthorizationUrl(string(params.RedirectUri), state.String())
	ctx := r.Context()
	v := ctx.Value(constant.CTX_KEY_STATE_EXPIRATION_SEC)
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
	cookie := helpers.GenOidcStateCookie(state.String(), opts)
	http.SetCookie(w, cookie)
	w.Header().Add("location", url)
	helpers.Send(w, http.StatusFound, nil)
}

func (a *authObj) OidcCallback(w http.ResponseWriter, r *http.Request) {
	state, err := r.Cookie(constant.COOKIE_KEY_OIDC_STATE)

	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}
	oidcCollback := &OidcCallbackPayload{}
	if err := helpers.BodyDecode(r, oidcCollback); err != nil {
		a.log.Errorf("body decode failed -> %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	if oidcCollback == nil || state == nil || oidcCollback.State != state.Value {
		a.log.Error(errors.MismatchState)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	ctx := r.Context()
	token, tokenErr := auth.SigninOidc(oidcCollback.Code, oidcCollback.RedirectUri, r)
	if tokenErr != nil {
		a.log.Errorf("tokenErr %v", tokenErr)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
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
	helpers.Send(w, http.StatusNoContent, nil)
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
	return &authObj{
		log: logging.GetDefaultLogger(),
	}
}
