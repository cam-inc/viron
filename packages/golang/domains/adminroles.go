package domains

import (
	"database/sql"
	"fmt"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/casbin/casbin/v2/model"

	sqladapter "github.com/Blank-Xu/sql-adapter"
	"github.com/casbin/casbin/v2"
)

type (
	/*
		export interface AdminRolePermission {
		  resourceId: string;
		  permission: Permission;
		}
	*/

	adminRolePermission struct {
		resourceID string
		permission string
	}

	/*
		export interface AdminRole {
		  id: string;
		  permissions: AdminRolePermissions;
		}
	*/

	adminRole struct {
		id          string
		permissions []*adminRolePermission
	}
)

const (
	modelText = `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act || g(r.sub, "super")
`
)

var (
	casbinInstance *casbin.Enforcer

	permissionMap = map[string][]string{
		constant.API_METHOD_GET:    []string{constant.PERMISSION_READ, constant.PERMISSION_WRITE},
		constant.API_METHOD_POST:   []string{constant.PERMISSION_WRITE},
		constant.API_METHOD_PUT:    []string{constant.PERMISSION_WRITE},
		constant.API_METHOD_DELETE: []string{constant.PERMISSION_WRITE},
	}
)

func NewMySQL(conn *sql.DB) error {
	a, err := sqladapter.NewAdapter(conn, "mysql", "casbin_rule")
	if err != nil {
		return err
	}
	m, err := model.NewModelFromString(modelText)
	if err != nil {
		return err
	}
	enforcer, err := casbin.NewEnforcer(m, a)
	if err != nil {
		return err
	}

	casbinInstance = enforcer
	return nil
}

/*
const getPermissions = (permissions?: Permission[]): Permission[] =>
  permissions?.length ? permissions : Object.values(PERMISSION);
*/

func getPermissions(permissions []string) []string {
	if len(permissions) == 0 {
		return []string{
			constant.PERMISSION_READ,
			constant.PERMISSION_WRITE,
			constant.PERMISSION_DENY,
		}
	}
	return permissions
}

/*
const genPolicy = (
  roleId: string,
  resourceId: string,
  permission: Permission
): Policy => [roleId, resourceId, permission];
*/
func genPolicy(roleID, resourceID, permission string) []string {
	return []string{
		roleID,
		resourceID,
		permission,
	}
}

/*
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

*/

func listPolicies(roleID string) [][]string {
	var policies [][]string
	if roleID == "" {
		policies = casbinInstance.GetPolicy()
	} else {
		policies = casbinInstance.GetFilteredPolicy(0, roleID)
	}
	return policies
}

/*
// APIメソッドをPermissionに変換
export const method2Permissions = (method: ApiMethod): Permission[] =>
  permissionMap[method];
*/

func method2Permissions(method string) []string {
	return permissionMap[method]
}

/*
// ロール一覧を取得
export const listRoles = async (userId: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  return await casbin.getRolesForUser(userId);
};
*/

func listRoles(userID string) []string {
	roles, err := casbinInstance.GetRolesForUser(userID)
	if err != nil {
		return []string{}
	}
	return roles
}

/*
// 指定したロールを持つユーザーの一覧を取得
export const listUsers = async (roleId: string): Promise<string[]> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  return await casbin.getUsersForRole(roleId);
};

*/

func listUsers(roleID string) []string {
	userIDs, err := casbinInstance.GetUsersForRole(roleID)
	if err != nil {
		return []string{}
	}
	return userIDs
}

/*
// ユーザーにロールを付与する
export const addRoleForUser = async (
  userId: string,
  roleId: string
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  return casbin.addRoleForUser(userId, roleId);
};

*/
func addRoleForUser(userID, roleID string) bool {
	ok, err := casbinInstance.AddRoleForUser(userID, roleID)
	return ok && err == nil
}

/*
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
*/
func updateRolesForUser(userID string, roleIDs []string) {
	for _, roleID := range roleIDs {
		RevokeRoleForUser(userID, roleID)
	}
}

/*
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
*/

func RevokeRoleForUser(userID, roleID string) bool {
	var ok bool
	var err error
	if roleID == "" {
		ok, err = casbinInstance.DeleteUser(userID)
	} else {
		ok, err = casbinInstance.DeleteRoleForUser(userID, roleID)
	}
	return ok && err == nil
}

/*
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
*/

func RevokePermissionForRole(roleID, resourceID string, permissions []string) bool {
	permissions = getPermissions(permissions)
	policies := [][]string{}
	for _, p := range permissions {
		policies = append(policies, genPolicy(roleID, resourceID, p))
	}

	ok, err := casbinInstance.RemovePolicies(policies)
	if err != nil {
		return false
	}
	return ok
}

/*
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
*/

func updatePermissionsForRole(roleID string, permissions []*adminRolePermission) {
	policies := [][]string{}
	for _, permission := range permissions {
		policies = append(policies, genPolicy(roleID, permission.resourceID, permission.permission))
	}
	removeRole(roleID)
	casbinInstance.AddPolicies(policies)
}

/*
// ロールを削除する
export const removeRole = async (roleId: string): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  return await casbin.deleteRole(roleId);
};
*/

func removeRole(roleID string) bool {
	ok, err := casbinInstance.DeleteRole(roleID)
	return ok && err == nil
}

/*
// idがリソースを操作する権限を持っているかチェック
export const hasPermissionByResourceId = async (
  id: string,
  resourceId: string,
  permissions: Permission[]
): Promise<boolean> => {
  const casbin = repositoryContainer.getCasbin();
  await sync();
  const tasks = permissions.map((permission) =>
    casbin.enforce(id, resourceId, permission)
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
*/

func hasPermissionByResourceID(id, resourceID string, permissions []string) bool {
	for _, permission := range permissions {
		if ok, err := casbinInstance.Enforce(id, resourceID, permission); !ok || err != nil {
			return false
		}
	}
	fmt.Println("")
	return true
}

/*
// ユーザーがリソースを操作する権限を持っているかチェック
export const hasPermission = async (
  userId: string,
  requestUri: string,
  requestMethod: ApiMethod,
  apiDefinition: VironOpenAPIObject
): Promise<boolean> => {
  const resourceId = getResourceId(requestUri, requestMethod, apiDefinition);
  if (!resourceId) {
    // TODO: セキュリティ的にあまりよくないのであとでなんとかする
    return true;
  }
  return await hasPermissionByResourceId(
    userId,
    resourceId,
    method2Permissions(requestMethod)
  );
};

*/

func hasPermission(userID, requestURI, requestMethod string, apiDef *openapi3.T) bool {
	resourceID := getResourceID(requestURI, requestMethod, apiDef)
	if resourceID == "" {
		return true
	}
	return hasPermissionByResourceID(userID, resourceID, method2Permissions(requestMethod))
}

/*

       this.casbin = await newEnforcer(
          domainsAdminRole.rbacModel,
          casbinSequelizeAdapter
        );



import { newModel } from 'casbin';
import { roleIdAlreadyExists } from '../errors';
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
import { getResourceId, VironOpenAPIObject } from './oas';
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
  if (repositoryContainer.casbinSyncedTime + CASBIN_SYNC_INTERVAL_MSEC > now) {
    await casbin.loadPolicy();
    repositoryContainer.casbinSyncedTime = now;
  }
};






















// リソース一覧
export const listResourcesByOas = (
  apiDefinitions: VironOpenAPIObject
): string[] => {
  const pages = apiDefinitions.info[OAS_X_PAGES];
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
  apiDefinitions: VironOpenAPIObject
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
  apiDefinitions: VironOpenAPIObject
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

*/
