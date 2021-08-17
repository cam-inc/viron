package domains

import (
	"context"

	"github.com/cam-inc/viron/packages/golang/repositories"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/repositories/container"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/helpers"
)

type (
	AdminAccount struct {
		ID       uint     `json:"ID"`
		Email    string   `json:"email"`
		AuthType string   `json:"type"`
		Password *string  `json:"password"`
		Salt     *string  `json:"salt"`
		RoleIDs  []string `json:"roleIds"`
	}

	/*
		AdminUsersWithPager struct {
				Pager
				List []*AdminUser `json:"list"`
			}
	*/
	AdminAccountsWithPager struct {
		Pager
		List []*AdminAccount `json:"list"`
	}
)

// ListAccountByID 一覧取得(idを指定するので結果は必ず1件)
func ListAccountByID(ctx context.Context, userID string) *AdminAccountsWithPager {
	user := FindByID(ctx, userID)
	pager := &AdminAccountsWithPager{
		List: []*AdminAccount{
			&AdminAccount{
				ID:       user.ID,
				Email:    user.Email,
				AuthType: user.AuthType,
				Password: user.Password,
				Salt:     user.Salt,
				RoleIDs:  user.RoleIDs,
			},
		},
	}
	pager.Pager = Pagging(1, 1, 1)
	return pager
}

// UpdateAccountByID IDで1件更新
func UpdateAccountByID(ctx context.Context, userID string, payload *AdminAccount) error {
	user := FindByID(ctx, userID)
	if user == nil {
		return errors.AdminUserNotfound
	}
	if user.AuthType != constant.AUTH_TYPE_EMAIL {
		return errors.Forbidden
	}
	repo := container.GetAdminUserRepository()

	adminUser := &repositories.AdminUser{
		ID:       user.ID,
		AuthType: user.AuthType,
		Email:    user.Email,
	}

	hashedNewPassword := helpers.GenPassword(*payload.Password, *user.Salt)
	adminUser.Password = &hashedNewPassword.Password
	return repo.UpdateByID(ctx, userID, adminUser)
}
