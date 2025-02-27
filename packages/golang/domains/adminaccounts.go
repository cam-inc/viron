package domains

import (
	"context"

	"github.com/cam-inc/viron/packages/golang/repositories"

	// "github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/repositories/container"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/helpers"
)

type (
	AdminAccount struct {
		ID       string   `json:"id"`
		Email    string   `json:"email"`
		AuthType string   `json:"type"`
		Password *string  `json:"password"`
		Salt     *string  `json:"salt"`
		RoleIDs  []string `json:"roleIds"`
	}

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
				Password: user.Password,
				Salt:     user.Salt,
				RoleIDs:  user.RoleIDs,
			},
		},
	}
	pager.Pager = Paging(1, 1, 1)
	return pager
}

// UpdateAccountByID IDで1件更新
func UpdateAccountByID(ctx context.Context, userID string, payload *AdminAccount) error {
	user := FindByID(ctx, userID)
	if user == nil {
		return errors.AdminUserNotfound
	}
	repo := container.GetAdminUserRepository()

	adminUser := &repositories.AdminUserEntity{
		ID:    user.ID,
		Email: user.Email,
	}

	hashedNewPassword := helpers.GenPassword(*payload.Password, *user.Salt)
	adminUser.Password = &hashedNewPassword.Password
	return repo.UpdateByID(ctx, userID, adminUser)
}
