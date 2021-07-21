package auth

import "net/http"

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

func New() ServerInterface {
	return &authObj{}
}
