package auth

import (
	"context"
	"fmt"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
)

/*
// Emailアドレスでサインイン
export const signinEmail = async (
  email: string,
  password: string
): Promise<string> => {
  let adminUser = await findOneByEmail(email);
  if (!adminUser) {
    const firstAdminUser = await createFirstAdminUser(
      { email, password },
      AUTH_TYPE.EMAIL
    );
    if (!firstAdminUser) {
      throw signinFailed();
    }
    adminUser = firstAdminUser;
  }

  if (
    adminUser.authType !== AUTH_TYPE.EMAIL ||
    !verifyPassword(
      password,
      adminUser.password as string,
      adminUser.salt as string
    )
  ) {
    throw signinFailed();
  }

  return signJwt(adminUser.id);
};


const format = (adminUser: AdminUser, roleIds?: string[]): AdminUserView => {
  return Object.assign({}, adminUser, { roleIds: roleIds ?? [] });
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

// ロール一覧を取得
export const listRoles = async (userId: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  return await casbin.getRolesForUser(userId);
};

*/

func SigninEmail(ctx context.Context, email string, password string) (string, *errors.VironError) {
	//repositories.GetAdminUserRepository().Find(ctx)

	user := domains.FindByEmail(ctx, email)
	if user == nil {
		payload := &domains.AdminUser{
			Email:    email,
			Password: &password,
			AuthType: constant.AUTH_TYPE_EMAIL,
		}
		var err error
		user, err = createFirstAdminUser(ctx, payload, payload.AuthType)
		if err != nil || user == nil {
			fmt.Println(err)
			return "", errors.SigninFailed
		}
	}

	return Sign(fmt.Sprintf("%d", user.ID)), nil
}

func listRoles(ctx context.Context, userID uint) []string {
	return []string{}
}
