package auth

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
)

// SigninEmail Emailアドレスでサインイン
func SigninEmail(r *http.Request, email string, password string) (string, *errors.VironError) {
	ctx := r.Context()
	user := domains.FindByEmail(ctx, email)
	log.Debugf("user(%s)", email)
	if user == nil {
		log.Debugf("user(%s) is nil", email)
		payload := &domains.AdminUser{
			Email:    email,
			Password: &password,
			AuthType: constant.AUTH_TYPE_EMAIL,
		}
		var err error
		user, err = createFirstAdminUser(ctx, payload, payload.AuthType)
		if err != nil || user == nil {
			return "", errors.SigninFailed
		}
	}

	if user.AuthType != constant.AUTH_TYPE_EMAIL {
		return "", errors.SigninFailed
	}
	if !helpers.VerifyPassword(password, *user.Password, *user.Salt) {
		return "", errors.SigninFailed
	}

	token, err := Sign(r, user.ID)
	if err != nil {
		log.Error("SigninEmail sign failed %#v \n", err)
		return "", errors.SigninFailed
	}
	return token, nil
}
