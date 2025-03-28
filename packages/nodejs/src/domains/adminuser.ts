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
  password?: string;
  roleIds?: string[];
}

export interface AdminUserUpdatePayload {
  password?: string;
  roleIds?: string[];
}

const formatWithCredential = (
  adminUser: AdminUser,
  roleIds?: string[]
): AdminUserWithCredential => {
  return Object.assign({}, adminUser, { roleIds: roleIds ?? [] });
};

const format = (adminUser: AdminUser, roleIds?: string[]): AdminUserView => {
  return {
    id: adminUser.id,
    email: adminUser.email,
    roleIds: roleIds ?? [],
    createdAt: adminUser.createdAt,
    updatedAt: adminUser.updatedAt,
  };
};

export const formatAdminUser = format;
export const formatAdminUserWithCredential = format;

const find = async (
  conditions: FindConditions<AdminUser> & { roleId?: string } = {},
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<AdminUser>> => {
  const repository = repositoryContainer.getAdminUserRepository();
  if (conditions.roleId) {
    const userIds = await listUsers(conditions.roleId);
    conditions = Object.assign({}, conditions, { userIds });
    delete conditions.roleId;
  }
  return await repository.findWithPager(conditions, size, page, sort);
};

// 一覧取得
export const list = async (
  conditions: FindConditions<AdminUser> & { roleId?: string } = {},
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<AdminUserView>> => {
  const result = await find(conditions, size, page, sort);
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) => format(adminUser, adminRoles.shift())),
  };
};

// 一覧取得(クレデンシャルあり)
export const listWithCredential = async (
  conditions: FindConditions<AdminUser> & { roleId?: string } = {},
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<AdminUserWithCredential>> => {
  const result = await find(conditions, size, page, sort);
  const adminRoles = await Promise.all(
    result.list.map((adminUser) => listRoles(adminUser.id))
  );
  return {
    ...result,
    list: result.list.map((adminUser) =>
      formatWithCredential(adminUser, adminRoles.shift())
    ),
  };
};

async function createOneUserAndRole(
  adminUserCreatePayload: AdminUserCreatePayload
): Promise<AdminUser> {
  const adminUserRepository = repositoryContainer.getAdminUserRepository();

  const { roleIds, ...adminUser } = adminUserCreatePayload;
  let updatePassword = {};
  if (adminUser.password) {
    updatePassword = {
      ...genPasswordHash(adminUser.password),
    };
  }

  const user = await adminUserRepository.createOne({
    ...adminUser,
    ...updatePassword,
  } as AdminUserCreateAttributes);

  if (roleIds?.length) {
    await updateRolesForUser(user.id, roleIds);
  }

  return user;
}

// 1件作成
export async function createOne(
  adminUserCreatePayload: AdminUserCreatePayload
): Promise<AdminUserView> {
  const { roleIds } = adminUserCreatePayload;
  const user = await createOneUserAndRole(adminUserCreatePayload);
  return format(user, roleIds);
}

// 1件作成(クレデンシャルあり)
export async function createOneWithCredential(
  adminUserCreatePayload: AdminUserCreatePayload
): Promise<AdminUserWithCredential> {
  const { roleIds } = adminUserCreatePayload;
  const user = await createOneUserAndRole(adminUserCreatePayload);
  return formatWithCredential(user, roleIds);
}

// IDで1件更新
export const updateOneById = async (
  id: string,
  payload: AdminUserUpdatePayload
): Promise<void> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await findOneWithCredentialById(id);
  if (!user) {
    throw adminUserNotFound();
  }

  const { roleIds, ...adminUser } = payload;
  if (user.password) {
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

// IDで1件取得(クレデンシャルあり)
export const findOneWithCredentialById = async (
  id: string
): Promise<AdminUserWithCredential | null> => {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOneById(id);
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return formatWithCredential(user, roleIds);
};

// emailで1件取得
export async function findOneByEmail(
  email: string
): Promise<AdminUserView | null> {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOne({ email });
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return format(user, roleIds);
}

// emailで1件取得(クレデンシャルあり)
export async function findOneWithCredentialByEmail(
  email: string
): Promise<AdminUserWithCredential | null> {
  const repository = repositoryContainer.getAdminUserRepository();
  const user = await repository.findOne({ email });
  if (!user) {
    return null;
  }
  const roleIds = await listRoles(user.id);
  return formatWithCredential(user, roleIds);
}

// 件数取得
export const count = async (): Promise<number> => {
  const repository = repositoryContainer.getAdminUserRepository();
  return await repository.count();
};
