package domains

import (
	"context"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/repositories/mysql/adminusers"

	"github.com/cam-inc/viron/packages/golang/repositories/container"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/repositories"
)

type (
	AdminUser struct {
		ID                       uint
		Email                    string
		AuthType                 string
		Password                 *string
		Salt                     *string
		GoogleOAuth2AccessToken  *string
		GoogleOAuth2ExpiryDate   *int
		GoogleOAuth2IdToken      *string
		GoogleOAuth2RefreshToken *string
		GoogleOAuth2TokenType    *string
		RoleIDs                  []string
	}
)

func CreateOne(ctx context.Context, payload *AdminUser, authType string) (*AdminUser, error) {

	adminUser := &repositories.AdminUser{}

	if authType == constant.AUTH_TYPE_EMAIL {
		email := string(payload.Email)
		adminUser.Email = email
		if payload.Password == nil {
			return nil, fmt.Errorf("password is nill")
		}
		password := helpers.GenPassword(*payload.Password, "")
		adminUser.Password = &password.Password
		adminUser.Salt = &password.Salt
	} else if authType == constant.AUTH_TYPE_GOOGLE {
		adminUser.GoogleOAuth2TokenType = payload.GoogleOAuth2TokenType
		adminUser.GoogleOAuth2IdToken = payload.GoogleOAuth2IdToken
		adminUser.GoogleOAuth2AccessToken = payload.GoogleOAuth2AccessToken
		adminUser.GoogleOAuth2RefreshToken = payload.GoogleOAuth2RefreshToken
		adminUser.GoogleOAuth2ExpiryDate = payload.GoogleOAuth2ExpiryDate
	}

	fmt.Printf("DEGBU CREATE ADMINUSER %+v\n", adminUser)
	fmt.Printf("DEBUG PASS %s\n", *adminUser.Password)

	entity, err := container.GetAdminUserRepository().CreateOne(ctx, adminUser)
	if err != nil {
		return nil, err
	}
	entity.Bind(adminUser)

	payload.ID = adminUser.ID

	// Role update
	// repositories.GetCasbinRepository()

	return payload, nil
}

func Count(ctx context.Context) int {
	repo := container.GetAdminUserRepository()
	return repo.Count(ctx, nil)
	/*
	    const repository = repositoryContainer.getAdminUserRepository();
	  return await repository.count();
	*/
}

func FindByEmail(ctx context.Context, email string) *AdminUser {
	repo := container.GetAdminUserRepository()

	conditions := &adminusers.AdminUserConditions{
		Email: email,
	}

	result, err := repo.Find(ctx, conditions)
	if err != nil || len(result) == 0 {
		fmt.Println(err)
		return nil
	}

	user := &repositories.AdminUser{}

	result[0].Bind(user)

	// user.RoleIDs = listRoles(ctx, user.ID)

	auser := &AdminUser{
		Email:    user.Email,
		Password: user.Password,
		AuthType: user.AuthType,
	}

	return auser
}

/*
// 1件作成
export const createOne = async (
  payload: AdminUserCreatePayload,
  authType: AuthType = AUTH_TYPE.EMAIL
): Promise<AdminUserView> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const { roleIds, ...adminUser } = payload;

  let obj;
  if (authType === AUTH_TYPE.EMAIL) {
    const adminUserEmail = adminUser as AdminUserEmailCreatePayload;
    obj = {
      authType: AUTH_TYPE.EMAIL,
      ...adminUserEmail,
      ...genPasswordHash(adminUserEmail.password),
    } as AdminUserEmailCreateAttributes;
  } else {
    const adminUserGoogle = adminUser as AdminUserGoogleCreatePayload;
    obj = {
      authType: AUTH_TYPE.GOOGLE,
      ...adminUserGoogle,
    } as AdminUserGoogleCreateAttributes;
  }
  const user = await repository.createOne(obj);

  if (roleIds?.length) {
    await updateRolesForUser(user.id, roleIds);
  }
  return format(user, roleIds);
};
*/

/*
const format = (adminUser: AdminUser, roleIds?: string[]): AdminUserView => {
  return Object.assign({}, adminUser, { roleIds: roleIds ?? [] });
};

// 一覧取得
export const list = async (
  conditions: FindConditions<AdminUser> & { roleId?: string } = {},
  size?: number,
  page?: number,
  sort?: string[]
): Promise<ListWithPager<AdminUserView>> => {
  const repository = repositoryContainer.getAdminUserRepository();
  if (conditions.roleId) {
    const userIds = await listUsers(conditions.roleId);
    conditions = Object.assign({}, conditions, { userIds });
    delete conditions.roleId;
  }
  const result = await repository.findWithPager(conditions, size, page, sort);
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) => format(adminUser, adminRoles.shift())),
  };
};



// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminUserUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneById(id);
  if (!user) {
    throw adminUserNotFound();
  }

  const { roleIds, ...adminUser } = payload;
  if (user.authType === AUTH_TYPE.EMAIL) {
    const adminUserEmail = adminUser as AdminUserEmailUpdatePayload;
    if (adminUserEmail.password) {
      await repository.updateOneById(
        id,
        genPasswordHash(adminUserEmail.password)
      );
    }
  } else {
    const adminUserGoogle = adminUser as AdminUserGoogleUpdatePayload;
    await repository.updateOneById(id, adminUserGoogle);
  }

  if (roleIds?.length) {
    await updateRolesForUser(id, roleIds);
  }
};

// IDで1件削除
export const removeOneById = async (id: string): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneById(id);
  if (!user) {
    throw adminUserNotFound();
  }
  await Promise.all([repository.removeOneById(id), revokeRoleForUser(id)]);
};

// IDで1件取得
export const findOneById = async (
  id: string
): Promise<AdminUserView | null> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOneById(id);
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return format(user, roleIds);
};

// emailで1件取得
export const findOneByEmail = async (
  email: string
): Promise<AdminUserView | null> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOne({ email });
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return format(user, roleIds);
};

// 件数取得
export const count = async (): Promise<number> => {
  const repository = repositoryContainer.getAdminUserRepository();
  return await repository.count();
};

*/
