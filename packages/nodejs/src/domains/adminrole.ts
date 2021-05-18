import { newModel } from 'casbin';
import { roleIdAlreadyExists } from '../errors';
import {
  ADMIN_ROLE,
  API_METHOD,
  ApiMethod,
  PERMISSION,
  Permission,
  OAS_X_PAGES,
} from '../constants';
import { ListWithPager, paging } from '../helpers';
import { repositoryContainer } from '../repositories';
import { OpenAPIObject, OasXPages } from './oas';

export interface AdminRolePermission {
  resourceId: string;
  permission: Permission;
}

export type AdminRolePermissions = AdminRolePermission[];

export interface AdminRole {
  id: string;
  permissions: AdminRolePermissions;
}

export type Policy = [string, string, Permission];

interface ParsedPolicy {
  roleId: string;
  resourceId: string;
  permission: Permission;
}

const permissionMap = {
  [API_METHOD.GET]: [PERMISSION.READ, PERMISSION.WRITE],
  [API_METHOD.POST]: [PERMISSION.WRITE],
  [API_METHOD.PUT]: [PERMISSION.WRITE],
  [API_METHOD.DELETE]: [PERMISSION.WRITE],
};

export const rbacModel = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act || r.sub == "${ADMIN_ROLE.SUPER}"
`);

const method2Permissions = (method: ApiMethod): Permission[] =>
  permissionMap[method];

const getPermissions = (permissions?: Permission[]): Permission[] =>
  permissions?.length ? permissions : Object.values(PERMISSION);

const genPolicy = (
  roleId: string,
  resourceId: string,
  permission: Permission
): Policy => [roleId, resourceId, permission];

const parsePolicy = (policy: Policy): ParsedPolicy => {
  return {
    roleId: policy[0],
    resourceId: policy[1],
    permission: policy[2],
  };
};

// ユーザー一覧を取得
export const listUsers = async (roleId?: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  return roleId
    ? await casbin.getUsersForRole(roleId)
    : await casbin.getAllSubjects();
};

// ロール一覧を取得
export const listRoles = async (userId?: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  return userId
    ? await casbin.getRolesForUser(userId)
    : await casbin.getAllRoles();
};

// ユーザーにロールを付与する
export const addRoleForUser = async (
  userId: string,
  roleId: string
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  return casbin.addRoleForUser(userId, roleId);
};

// ユーザーからロールを剥奪する
export const revokeRoleForUser = async (
  userId: string,
  roleId?: string
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  return roleId
    ? await casbin.deleteRoleForUser(userId, roleId)
    : await casbin.deleteUser(userId);
};

// ユーザーのロールを更新する
export const updateRolesForUser = async (
  userId: string,
  roleIds: string[]
): Promise<void> => {
  await revokeRoleForUser(userId);
  await Promise.all(
    roleIds.map((roleId: string) => addRoleForUser(userId, roleId))
  );
};

// ポリシー一覧を取得
export const listPolicies = async (
  roleId?: string
): Promise<ParsedPolicy[]> => {
  const casbin = repositoryContainer.getCasbin();
  const policies = roleId
    ? await casbin.getFilteredPolicy(0, roleId)
    : await casbin.getPolicy();
  return policies.map((policy) => parsePolicy(policy as Policy));
};

// ロールから権限を剥奪する
export const revokePermissionForRole = async (
  roleId: string,
  resourceId: string,
  permissions?: Permission[]
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  permissions = getPermissions(permissions);
  const policies = permissions.map((permission: Permission) =>
    genPolicy(roleId, resourceId, permission)
  );
  await Promise.all(policies.map((policy) => casbin.removePolicy(...policy)));
  return true;
};

// ロールの権限を更新する
export const updatePermissionsForRole = async (
  roleId: string,
  permissions: AdminRolePermissions
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  const policies = permissions.map(
    ({ resourceId, permission }): Policy =>
      genPolicy(roleId, resourceId, permission)
  );
  await removeRole(roleId);
  await Promise.all(policies.map((policy) => casbin.addPolicy(...policy)));
  return true;
};

// ロールを削除する
export const removeRole = async (roleId: string): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  return await casbin.deleteRole(roleId);
};

// ユーザーがリソースを操作する権限を持っているかチェック
export const hasPermission = async (
  userId: string,
  resourceId: string,
  apiMethod: ApiMethod
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  const permissions = method2Permissions(apiMethod);
  return await Promise.any(
    permissions.map((permission) =>
      casbin.enforce(userId, resourceId, permission)
    )
  );
};

// リソース一覧
export const listResourcesByOas = (apiDefinitions: OpenAPIObject): string[] => {
  const pages: OasXPages = apiDefinitions.info[OAS_X_PAGES];
  const result = pages
    .map((page) => {
      return (page?.contents ?? []).map((content) => content.resourceId);
    })
    .flat()
    .sort();
  return result;
};

// 管理ロール一覧
export const listByOas = async (
  apiDefinitions: OpenAPIObject
): Promise<ListWithPager<AdminRole>> => {
  const policies = await listPolicies();
  const resourceIds = listResourcesByOas(apiDefinitions);

  const map = policies.reduce(
    (
      ret: Record<string, Record<string, Permission>>,
      { roleId, resourceId, permission }
    ) => {
      ret[roleId] = ret[roleId] || {};
      ret[roleId][resourceId] = permission;
      return ret;
    },
    {}
  );
  const result = Object.keys(map).map((roleId) => {
    return {
      id: roleId,
      permissions: resourceIds.map((resourceId: string) => {
        return {
          resourceId,
          permission: map[roleId][resourceId] ?? PERMISSION.DENY,
        };
      }),
    };
  });
  return paging(result, result.length);
};

// 1件作成
export const createOne = async (obj: AdminRole): Promise<AdminRole> => {
  const roleId = obj.id;
  const policies = await listPolicies(roleId);
  if (policies?.length) {
    throw roleIdAlreadyExists();
  }
  await updatePermissionsForRole(roleId, obj.permissions);
  return obj;
};

// IDで1件更新
export const updateOneById = async (
  roleId: string,
  permissions: AdminRolePermissions
): Promise<void> => {
  await updatePermissionsForRole(roleId, permissions);
};

// IDで1件削除
export const removeOneById = async (roleId: string): Promise<void> => {
  await removeRole(roleId);
};

// viewerロールを作成
export const createViewer = async (
  apiDefinitions: OpenAPIObject
): Promise<boolean> => {
  const policies = await listPolicies(ADMIN_ROLE.VIEWER);
  const resourceIds = listResourcesByOas(apiDefinitions);
  if (policies.length === resourceIds.length) {
    // 更新するものがないので何もしない
    return false;
  }

  const map = policies.reduce(
    (ret: Record<string, Permission>, policy: ParsedPolicy) => {
      ret[policy.resourceId] = policy.permission;
      return ret;
    },
    {}
  );
  const permissions = resourceIds.map((resourceId: string) => {
    return {
      resourceId,
      permission: map[resourceId] ?? PERMISSION.READ,
    };
  });
  await updatePermissionsForRole(ADMIN_ROLE.VIEWER, permissions);
  return true;
};
