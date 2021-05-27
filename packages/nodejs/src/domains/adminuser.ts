import { AUTH_TYPE, AuthType } from '../constants';
import { ListWithPager, genPasswordHash } from '../helpers';
import { repositoryContainer } from '../repositories';
import { adminUserNotFound } from '../errors';
import { listRoles, revokeRoleForUser, updateRolesForUser } from './adminrole';

export interface AdminUser {
  id: string;
  email: string;
  authType: string;
  password: string | null;
  salt: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserCreateAttributes {
  email: string;
  authType: string;
  password: string | null;
  salt: string | null;
}

export interface AdminUserUpdateAttributes {
  password: string | null;
  salt: string | null;
}

export interface AdminUserView extends AdminUser {
  roleIds: string[];
}

export interface AdminUserCreatePayload {
  email: string;
  password: string;
  roleIds?: string[];
}

export interface AdminUserUpdatePayload {
  password?: string;
  roleIds?: string[];
}

const format = (adminUser: AdminUser, roleIds?: string[]): AdminUserView => {
  return Object.assign({}, adminUser, { roleIds: roleIds ?? [] });
};

// 一覧取得
export const list = async (): Promise<ListWithPager<AdminUserView>> => {
  const repository = repositoryContainer.getAdminUserRepository();
  // TODO: 検索
  const result = await repository.findWithPager();
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) => format(adminUser, adminRoles.shift())),
  };
};

// 1件作成
export const createOne = async (
  payload: AdminUserCreatePayload,
  authType: AuthType = AUTH_TYPE.EMAIL
): Promise<AdminUserView> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const { roleIds, ...adminUser } = payload;
  const user = await repository.createOne({
    authType,
    ...adminUser,
    ...genPasswordHash(adminUser.password),
  });
  if (roleIds?.length) {
    await updateRolesForUser(user.id, roleIds);
  }
  return format(user, roleIds);
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
  if (adminUser.password) {
    await repository.updateOneById(id, genPasswordHash(adminUser.password));
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
