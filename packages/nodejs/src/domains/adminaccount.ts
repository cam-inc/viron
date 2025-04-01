import { ListWithPager, genPasswordHash } from '../helpers';
import { repositoryContainer } from '../repositories';
import { adminUserNotFound, forbidden } from '../errors';
import { listRoles } from './adminrole';
import {
  AdminUserWithCredential,
  AdminUserView,
  formatAdminUser,
  findOneWithCredentialById,
} from './adminuser';

export interface AdminAccountUpdatePayload {
  password: string;
}

// 一覧取得(idを指定するので結果は必ず1件)
export const listById = async (
  id: string
): Promise<ListWithPager<AdminUserWithCredential | AdminUserView>> => {
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

// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminAccountUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneWithCredentialById(id);
  if (!user) {
    throw adminUserNotFound();
  }

  if (user.password) {
    await repository.updateOneById(id, genPasswordHash(payload.password));
  } else {
    throw forbidden();
  }
};
