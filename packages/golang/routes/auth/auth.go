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
	log           logging.Logger
	domainAuthSSO *auth.AuthSSO
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

func (a *authObj) SsoOidcAuthorization(w http.ResponseWriter, r *http.Request, params SsoOidcAuthorizationParams) {
	state, err := uuid.NewUUID()
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	clientID := string(params.ClientId)
	redirectUri := string(params.RedirectUri)

	// PKCE用のCodeVerifierを生成
	codeVerifier := a.domainAuthSSO.GenOIDCCodeVerifier(clientID)

	// OIDC認証画面URLを取得
	url := a.domainAuthSSO.GetOIDCAuthorizationUrl(clientID, redirectUri, codeVerifier, state.String())

	// CookieにOIDCのStateとPKCE用のCodeVerifierをセット
	ctx := r.Context()
	var age int
	if v := ctx.Value(constant.CTX_KEY_CODE_VERIFIER_EXPIRATION_SEC); v != nil {
		age, _ = v.(int)
	}
	opts := &http.Cookie{
		MaxAge:   age,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   r.URL.Hostname(),
	}
	stateCookie := helpers.GenOidcStateCookie(state.String(), opts)
	http.SetCookie(w, stateCookie)
	codeVerifierCookie := helpers.GenOidcCodeVerifierCookie(codeVerifier, opts)
	http.SetCookie(w, codeVerifierCookie)
	w.Header().Add("location", url)
	helpers.Send(w, http.StatusFound, nil)
}

func (a *authObj) SsoOidcCallback(w http.ResponseWriter, r *http.Request) {
	state, err := r.Cookie(constant.COOKIE_KEY_OIDC_STATE)
	if err != nil {
		a.log.Errorf("cookie oidc_state err: %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}
	codeVerifier, err := r.Cookie(constant.COOKIE_KEY_OIDC_CODE_VERIFIER)
	if err != nil {
		a.log.Errorf("cookie oidc_code_verifier err: %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	oidcCollbackPayload := &SsoOidcCallbackPayload{}
	if err := helpers.BodyDecode(r, oidcCollbackPayload); err != nil {
		a.log.Errorf("body decode failed -> %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	if state == nil || oidcCollbackPayload.State != state.Value || codeVerifier == nil {
		a.log.Error(errors.MismatchState)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	ctx := r.Context()
	token, errSigninOdic := a.domainAuthSSO.SigninOIDC(r, oidcCollbackPayload.ClientId, oidcCollbackPayload.RedirectUri, oidcCollbackPayload.Code, oidcCollbackPayload.State, codeVerifier.Value)
	if errSigninOdic != nil {
		a.log.Errorf("errSigninOdic %v", errSigninOdic)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
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

func New(domainAuthSSO *auth.AuthSSO) ServerInterface {
	return &authObj{
		log:           logging.GetDefaultLogger(),
		domainAuthSSO: domainAuthSSO,
	}
}
