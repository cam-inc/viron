package auth

import (
	"context"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/cam-inc/viron/packages/golang/domains"
)

func createFirstAdminUser(ctx context.Context, payload *domains.AdminUser, authType string) (*domains.AdminUser, error) {
	if domains.CountAdminUser(ctx) != 0 {
		return nil, nil
	}
	user, err := domains.CreateAdminUser(ctx, payload, authType)
	if err != nil {
		return nil, err
	}

	if ret := domains.AddRoleForUser(user.ID, constant.ADMIN_ROLE_SUPER); !ret {
		return nil, fmt.Errorf("AddRoleForUser return %v", ret)
	}

	return user, nil

}
