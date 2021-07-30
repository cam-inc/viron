package auth

import (
	"context"

	"github.com/cam-inc/viron/packages/golang/domains"
)

func createFirstAdminUser(ctx context.Context, payload *domains.AdminUser, authType string) (*domains.AdminUser, error) {
	if domains.Count(ctx) != 0 {
		return nil, nil
	}
	user, err := domains.CreateOne(ctx, payload, authType)
	if err != nil {
		return nil, err
	}

	/*

		await addRoleForUser(user.id, ADMIN_ROLE.SUPER);
	*/

	return user, nil

}
