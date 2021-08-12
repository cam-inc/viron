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
)

/*
// 一覧取得(idを指定するので結果は必ず1件)
export const listById = async (
  id: string
): Promise<ListWithPager<AdminUserView>> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const result = await repository.findWithPager({ id });
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) =>
      formatAdminUser(adminUser, adminRoles.shift())
    ),
  };
};
*/

// ListAccountByID 一覧取得(idを指定するので結果は必ず1件)
func ListAccountByID(ctx context.Context, userID string) *helpers.PagerResults {
	user := FindByID(ctx, userID)
	return helpers.Paging([]interface{}{user}, 1, 1)
}

/*
// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminAccountUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneById(id);
  if (!user) {
    throw adminUserNotFound();
  }

  if (user.authType === AUTH_TYPE.EMAIL) {
    await repository.updateOneById(id, genPasswordHash(payload.password));
  } else {
    throw forbidden();
  }
};

*/

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
