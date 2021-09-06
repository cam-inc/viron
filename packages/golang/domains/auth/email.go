package auth

import (
	"context"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
)

// SigninEmail Emailアドレスでサインイン
func SigninEmail(ctx context.Context, email string, password string) (string, *errors.VironError) {
	user := domains.FindByEmail(ctx, email)
	if user == nil {
		fmt.Println("user is nil")
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

	return Sign(user.ID), nil
}
