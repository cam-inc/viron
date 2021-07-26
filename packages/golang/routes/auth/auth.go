package auth

import (
	"net/http"

	"github.com/getkin/kin-openapi/openapi3"
)

type authObj struct {
}

func (a *authObj) SigninEmail(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
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
