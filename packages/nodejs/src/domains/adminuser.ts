import { TABLE_SORT_DELIMITER, TABLE_SORT_ORDER } from '../constants';
import { ListWithPager, genPasswordHash } from '../helpers';
import { FindConditions, repositoryContainer } from '../repositories';
import { adminUserNotFound } from '../errors';
import {
  listRoles,
  listUsers,
  revokeRoleForUser,
  updateRolesForUser,
} from './adminrole';
import { removeAllByUserId } from './adminuserssotoken';

export interface AdminUser {
  id: string;
  email: string;
  password: string | null;
  salt: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type AdminUserBase = Pick<
  AdminUser,
  'id' | 'email' | 'createdAt' | 'updatedAt'
>;

export interface AdminUserCreateAttributes {
  email: string;
  password: string | null;
  salt: string | null;
}

export interface AdminUserUpdateAttributes {
  password: string | null;
  salt: string | null;
}

export interface AdminUserWithCredential extends AdminUser {
  roleIds: string[];
}

export interface AdminUserView extends AdminUserBase {
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

const format = (
  withCredential: boolean,
  adminUser: AdminUser,
  roleIds?: string[]
): AdminUserWithCredential | AdminUserView => {
  if (withCredential === true) {
    return Object.assign({}, adminUser, { roleIds: roleIds ?? [] });
  }
  return {
    id: adminUser.id,
    email: adminUser.email,
    roleIds: roleIds ?? [],
    createdAt: adminUser.createdAt,
    updatedAt: adminUser.updatedAt,
  };
};
export const formatAdminUser = format;

// 一覧取得
export const list = async (
  conditions: FindConditions<AdminUser> & { roleId?: string } = {},
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`],
  withCredential = false
): Promise<ListWithPager<AdminUserWithCredential | AdminUserView>> => {
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
    list: result.list.map((adminUser) =>
      format(withCredential, adminUser, adminRoles.shift())
    ),
  };
};

// 1件作成
export async function createOne(
  withCredential: boolean,
  adminUserCreatePayload: AdminUserCreatePayload
): Promise<AdminUserWithCredential | AdminUserView> {
  const adminUserRepository = repositoryContainer.getAdminUserRepository();

  const { roleIds, ...adminUser } = adminUserCreatePayload;

  const user = await adminUserRepository.createOne({
    ...adminUser,
  } as AdminUserCreateAttributes);

  if (roleIds?.length) {
    await updateRolesForUser(user.id, roleIds);
  }

  return format(withCredential, user, roleIds);
}

// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminUserUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneById(id, true);
  if (!user) {
    throw adminUserNotFound();
  }

  const { roleIds, ...adminUser } = payload;
  if ((user as AdminUserWithCredential).password) {
    const adminUserEmail = adminUser as AdminUserUpdatePayload;
    if (adminUserEmail.password) {
      const obj = {
        ...genPasswordHash(adminUserEmail.password),
      } as AdminUserUpdateAttributes;

      await repository.updateOneById(id, obj);
    }
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
  await Promise.all([
    repository.removeOneById(id),
    revokeRoleForUser(id),
    removeAllByUserId(id),
  ]);
};

// IDで1件取得
export const findOneById = async (
  id: string,
  withCredencial = false
): Promise<AdminUserWithCredential | AdminUserView | null> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOneById(id);
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return format(withCredencial, user, roleIds);
};

// オーバーロード
export async function findOneByEmail(
  email: string,
  withCredential: true
): Promise<AdminUserWithCredential | null>;

// オーバーロード
export async function findOneByEmail(
  email: string,
  withCredential: false
): Promise<AdminUserView | null>;

// オーバーロード
export async function findOneByEmail(
  email: string
): Promise<AdminUserView | null>;

// emailで1件取得
export async function findOneByEmail(
  email: string,
  withCredential = false
): Promise<AdminUserWithCredential | AdminUserView | null> {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOne({ email });
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return format(withCredential, user, roleIds);
}

// 件数取得
export const count = async (): Promise<number> => {
  const repository = repositoryContainer.getAdminUserRepository();
  return await repository.count();
};
