import { newModel } from 'casbin';
import {
  roleIdAlreadyExists,
  unableToDeleteRole,
  invalidAdminRole,
} from '../errors';
import {
  ADMIN_ROLE,
  API_METHOD,
  ApiMethod,
  PERMISSION,
  Permission,
  OAS_X_PAGES,
  OAS_X_PAGE_CONTENTS,
  OAS_X_PAGE_CONTENT_RESOURCE_ID,
  CASBIN_SYNC_INTERVAL_MSEC,
} from '../constants';
import { ListWithPager, paging } from '../helpers';
import { repositoryContainer } from '../repositories';
import { findOperation, getResourceId, VironOpenAPIObject } from './oas';
import { getDebug } from '../logging';

const debug = getDebug('domains:adminrole');

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
  [API_METHOD.GET]: [PERMISSION.READ, PERMISSION.WRITE, PERMISSION.ALL],
  [API_METHOD.POST]: [PERMISSION.WRITE, PERMISSION.ALL],
  [API_METHOD.PUT]: [PERMISSION.WRITE, PERMISSION.ALL],
  [API_METHOD.PATCH]: [PERMISSION.WRITE, PERMISSION.ALL],
  [API_METHOD.DELETE]: [PERMISSION.ALL],
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
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act || g(r.sub, "${ADMIN_ROLE.SUPER}")
`);

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

// casbinインスタンスとDBの差異を解消するために同期する
const sync = async (now = Date.now()): Promise<void> => {
  const casbin = repositoryContainer.getCasbin();
  if (repositoryContainer.casbinSyncedTime + CASBIN_SYNC_INTERVAL_MSEC < now) {
    await casbin.loadPolicy();
    repositoryContainer.casbinSyncedTime = now;
  }
};

// adminroles(casbin_rule)で不正な文字列チェック
const validateAdminRole = (obj: AdminRole): void => {
  console.log('validateAdminRole: ', obj);
  // obj.idにカンマ、シングルクォート、ダブルクォートが文字列に含まれないことを確認
  if (/[,'"]/.test(obj.id)) {
    throw invalidAdminRole();
  }
  for (const { resourceId, permission } of obj.permissions) {
    // resourceIdにカンマ、シングルクォート、ダブルクォートが文字列に含まれないことを確認
    if (/[,'"]/.test(resourceId)) {
      throw invalidAdminRole();
    }
    // permissionがPermissionに含まれることを確認
    if (!Object.values(PERMISSION).includes(permission)) {
      throw invalidAdminRole();
    }
  }
};

// APIメソッドをPermissionに変換
export const method2Permissions = (method: ApiMethod): Permission[] =>
  permissionMap[method];

// ロール一覧を取得
export const listRoles = async (userId: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  return await casbin.getRolesForUser(userId);
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
  await sync();
  const policies = roleId
    ? await casbin.getFilteredPolicy(0, roleId)
    : await casbin.getPolicy();
  return policies.map((policy) => parsePolicy(policy as Policy));
};

// 指定したロールを持つユーザーの一覧を取得
export const listUsers = async (roleId: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  return await casbin.getUsersForRole(roleId);
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

// idがリソースを操作する権限を持っているかチェック
export const hasPermissionByResourceId = async (
  id: string,
  resourceId: string,
  permissions: Permission[]
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  const tasks = permissions.map((permission) =>
    casbin.enforce(id, resourceId, permission).catch((e) => {
      debug(
        'Casbin Enforce failure. id: %s, resourceId: %s, permission: %s, error: %o',
        id,
        resourceId,
        permission,
        e
      );
      return false;
    })
  );
  for await (const allowed of tasks) {
    if (allowed) {
      return true;
    }
  }
  debug(
    'Don`t have permission to access. id: %s, resourceId: %s, permissions: %O',
    id,
    resourceId,
    permissions
  );
  return false;
};

// idがAPIをコールする権限を持っているかチェック
export const hasPermission = async (
  id: string,
  requestUri: string,
  requestMethod: ApiMethod,
  oas: VironOpenAPIObject
): Promise<boolean> => {
  const resourceId = getResourceId(requestUri, requestMethod, oas);
  if (!resourceId) {
    // リソースに紐づかないAPIはオペレーションがあれば通す
    const operation = findOperation(requestUri, requestMethod, oas);
    return !!operation;
  }
  return await hasPermissionByResourceId(
    id,
    resourceId,
    method2Permissions(requestMethod)
  );
};

// リソース一覧
export const listResourcesByOas = (oas: VironOpenAPIObject): string[] => {
  const pages = oas.info[OAS_X_PAGES];
  if (!pages?.length) {
    return [];
  }
  const result = pages
    .map((page) =>
      (page?.[OAS_X_PAGE_CONTENTS] ?? []).map(
        (content) => content[OAS_X_PAGE_CONTENT_RESOURCE_ID]
      )
    )
    .flat()
    .sort();
  return result;
};

// 管理ロール一覧
export const listByOas = async (
  oas: VironOpenAPIObject
): Promise<ListWithPager<AdminRole>> => {
  const policies = await listPolicies();
  const resourceIds = listResourcesByOas(oas);

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
  validateAdminRole(obj);
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
  validateAdminRole({ id: roleId, permissions });
  await updatePermissionsForRole(roleId, permissions);
};

// IDで1件削除
export const removeOneById = async (roleId: string): Promise<void> => {
  const users = await listUsers(roleId);
  if (users.length) {
    // ユーザーに紐づけられているロールは削除できない
    throw unableToDeleteRole();
  }
  await removeRole(roleId);
};

// viewerロールを作成
export const createViewer = async (
  oas: VironOpenAPIObject
): Promise<boolean> => {
  const policies = await listPolicies(ADMIN_ROLE.VIEWER);
  if (policies.length) {
    // すでにviewerがある場合は何もしない
    return false;
  }

  const map = policies.reduce(
    (ret: Record<string, Permission>, policy: ParsedPolicy) => {
      ret[policy.resourceId] = policy.permission;
      return ret;
    },
    {}
  );
  const resourceIds = listResourcesByOas(oas);
  const permissions = resourceIds.map((resourceId: string) => {
    return {
      resourceId,
      permission: map[resourceId] ?? PERMISSION.READ,
    };
  });
  await updatePermissionsForRole(ADMIN_ROLE.VIEWER, permissions);
  return true;
};

export const isApiMethod = (method: string): method is ApiMethod =>
  Object.values<string>(API_METHOD).includes(method);
