package auth

import (
	"context"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/cam-inc/viron/packages/golang/domains"
)

func createFirstAdminUser(ctx context.Context, user *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	if domains.CountAdminUser(ctx) != 0 {
		return nil, nil, nil
	}
	return createAdminUser(ctx, user, ssoToken, authType, constant.ADMIN_ROLE_SUPER)
}

func createViewer(ctx context.Context, user *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	return createAdminUser(ctx, user, ssoToken, authType, constant.ADMIN_ROLE_VIEWER)
}

func createAdminUser(ctx context.Context, payload *domains.AdminUser, ssoToken *domains.AdminUserSSOToken, authType string, roleID string) (*domains.AdminUser, *domains.AdminUserSSOToken, error) {
	user, err := domains.CreateAdminUser(ctx, payload, authType)
	if err != nil {
		return nil, nil, err
	}
	if authType == constant.AUTH_TYPE_OIDC {
		ssoToken.UserID = user.ID
		ssoToken, err = domains.CreateAdminUserSSOToken(ctx, ssoToken, authType)
		if err != nil {
			return user, nil, err
		}
	}
	if ret := domains.AddRoleForUser(user.ID, roleID); !ret {
		return user, ssoToken, fmt.Errorf("AddRoleForUser return %v", ret)
	}
	return user, ssoToken, nil
}
