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

type authInstance struct {
	log        logging.Logger
	domainAuth *auth.Auth
}

// SigninEmail emailサインイン
func (a *authInstance) SigninEmail(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	signinEmail := &SigninEmailPayload{}
	// リクエストボディをデコード
	if err := helpers.BodyDecode(r, signinEmail); err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, err)
		return
	}

	// メールアドレスとパスワードが空の場合はエラー
	if signinEmail.Email == "" || signinEmail.Password == "" {
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	// サインイン
	token, err := auth.SigninEmail(r, string(signinEmail.Email), signinEmail.Password)
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, err.StatusCode(), err)
		return
	}

	// cookieに認証トークンをセット
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

// Oauth2GoogleAuthorization GoogleOAuth2認可URL取得
func (a *authInstance) Oauth2GoogleAuthorization(w http.ResponseWriter, r *http.Request, params Oauth2GoogleAuthorizationParams) {
	state, err := uuid.NewUUID()
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	clientID := string(params.ClientId)
	redirectUri := string(params.RedirectUri)

	// PKCE用のCodeVerifierを生成
	codeVerifier := a.domainAuth.GenGoogleOAuth2CodeVerifier(clientID)

	// OIDC認証画面URLを取得
	url := a.domainAuth.GenGoogleOAuth2AuthorizationUrl(clientID, redirectUri, codeVerifier, state.String())

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
	stateCookie := helpers.GenGoogleOAuth2StateCookie(state.String(), opts)
	http.SetCookie(w, stateCookie)
	codeVerifierCookie := helpers.GenGoogleOAuth2CodeVerifierCookie(codeVerifier, opts)
	http.SetCookie(w, codeVerifierCookie)
	w.Header().Add("location", url)
	helpers.Send(w, http.StatusFound, nil)
}

// Oauth2GoogleCallback GoogleOAuth2コールバック
func (a *authInstance) Oauth2GoogleCallback(w http.ResponseWriter, r *http.Request) {
	state, err := r.Cookie(constant.COOKIE_KEY_GOOGLE_OAUTH2_STATE)
	if err != nil {
		a.log.Errorf("cookie google_oauth2_state err: %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}
	codeVerifier, err := r.Cookie(constant.COOKIE_KEY_GOOGLE_OAUTH2_CODE_VERIFIER)
	if err != nil {
		a.log.Errorf("cookie google_oauth2_code_verifier err: %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	callbackPayload := &OAuth2GoogleCallbackPayload{}
	if err := helpers.BodyDecode(r, callbackPayload); err != nil {
		a.log.Errorf("body decode failed -> %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	if state == nil || callbackPayload.State != state.Value || codeVerifier == nil {
		a.log.Error(errors.MismatchState)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	ctx := r.Context()
	token, errSigninGoogleOAuth2 := a.domainAuth.SigninGoogleOAuth2(r, callbackPayload.ClientId, callbackPayload.RedirectUri, callbackPayload.Code, callbackPayload.State, codeVerifier.Value)
	if errSigninGoogleOAuth2 != nil {
		a.log.Errorf("errSigninGoogleOAuth2 %v", errSigninGoogleOAuth2)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	v := ctx.Value(constant.CTX_KEY_JWT_EXPIRATION_SEC)
	var age int
	if v != nil {
		age, _ = v.(int)
	}
	http.SetCookie(w, helpers.GenAuthorizationCookie(
		token, &http.Cookie{
			MaxAge:   age,
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
			Domain:   r.URL.Hostname(),
		}))
	helpers.Send(w, http.StatusNoContent, nil)
}

// OidcAuthorization OIDC認可URL取得
func (a *authInstance) OidcAuthorization(w http.ResponseWriter, r *http.Request, params OidcAuthorizationParams) {
	state, err := uuid.NewUUID()
	if err != nil {
		a.log.Errorf("%v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.SigninFailed)
		return
	}

	clientID := string(params.ClientId)
	redirectUri := string(params.RedirectUri)

	// PKCE用のCodeVerifierを生成
	codeVerifier := a.domainAuth.GenOIDCCodeVerifier(clientID)

	// OIDC認証画面URLを取得
	url := a.domainAuth.GenOIDCAuthorizationUrl(clientID, redirectUri, codeVerifier, state.String())

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
	http.SetCookie(w, helpers.GenOidcStateCookie(state.String(), opts))
	http.SetCookie(w, helpers.GenOidcCodeVerifierCookie(codeVerifier, opts))
	w.Header().Add("location", url)
	helpers.Send(w, http.StatusFound, nil)
}

// OidcCallback OIDCコールバック
func (a *authInstance) OidcCallback(w http.ResponseWriter, r *http.Request) {
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

	callbackPayload := &OidcCallbackPayload{}
	if err := helpers.BodyDecode(r, callbackPayload); err != nil {
		a.log.Errorf("body decode failed -> %v", err)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	if state == nil || callbackPayload.State != state.Value || codeVerifier == nil {
		a.log.Error(errors.MismatchState)
		helpers.SendError(w, http.StatusBadRequest, errors.MismatchState)
		return
	}

	ctx := r.Context()
	token, errSigninOIDC := a.domainAuth.SigninOIDC(r, callbackPayload.ClientId, callbackPayload.RedirectUri, callbackPayload.Code, callbackPayload.State, codeVerifier.Value)
	if errSigninOIDC != nil {
		a.log.Errorf("errSigninOIDC %v", errSigninOIDC)
		helpers.SendError(w, http.StatusBadRequest, errors.UnAuthorized)
		return
	}

	v := ctx.Value(constant.CTX_KEY_JWT_EXPIRATION_SEC)
	var age int
	if v != nil {
		age, _ = v.(int)
	}
	http.SetCookie(w, helpers.GenAuthorizationCookie(token, &http.Cookie{
		MaxAge:   age,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   r.URL.Hostname(),
	}))
	helpers.Send(w, http.StatusNoContent, nil)
}

func (a *authInstance) Signout(w http.ResponseWriter, r *http.Request) {
	token, _ := helpers.GetCookieToken(r)
	if token == "" {
		helpers.Send(w, http.StatusNoContent, nil)
	}

	if !auth.SignOut(r.Context(), token) {
		logging.GetDefaultLogger().Warn("signount failed.")
	}

	http.SetCookie(w, helpers.GenCookie(constant.COOKIE_KEY_VIRON_AUTHORIZATION, "", &http.Cookie{
		MaxAge:   -1,
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Domain:   r.URL.Hostname(),
	}))
	helpers.Send(w, http.StatusNoContent, nil)
}

func (a *authInstance) LoadOas() *openapi3.T {
	oas, _ := GetSwagger()
	return oas
}

func New(domainAuth *auth.Auth) ServerInterface {
	return &authInstance{
		log:        logging.GetDefaultLogger(),
		domainAuth: domainAuth,
	}
}
