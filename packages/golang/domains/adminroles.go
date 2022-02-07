package domains

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/casbin/casbin/v2/model"

	sqladapter "github.com/Blank-Xu/sql-adapter"
	"github.com/casbin/casbin/v2"
	mongodbadapter "github.com/casbin/mongodb-adapter/v3"
)

type (
	AdminRolePermission struct {
		ResourceID string `json:"resourceId"`
		Permission string `json:"permission"`
	}

	AdminRole struct {
		ID          string                 `json:"id"`
		Permissions []*AdminRolePermission `json:"permissions,omitempty"`
	}

	AdminRolesWithPager struct {
		Pager
		List []*AdminRole `json:"list"`
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

	syncedTime int64

	permissionMap = map[string][]string{
		constant.API_METHOD_GET:    []string{constant.PERMISSION_READ, constant.PERMISSION_WRITE, constant.PERMISSION_ALL},
		constant.API_METHOD_POST:   []string{constant.PERMISSION_WRITE, constant.PERMISSION_ALL},
		constant.API_METHOD_PUT:    []string{constant.PERMISSION_WRITE, constant.PERMISSION_ALL},
		constant.API_METHOD_PATCH:  []string{constant.PERMISSION_WRITE, constant.PERMISSION_ALL},
		constant.API_METHOD_DELETE: []string{constant.PERMISSION_ALL},
	}

	log logging.Logger
)

func new(params ...interface{}) error {
	log = logging.GetDefaultLogger()
	if casbinInstance != nil {
		return nil
	}
	enforcer, err := casbin.NewEnforcer(params...)
	if err != nil {
		return err
	}
	enforcer.LoadPolicy()
	casbinInstance = enforcer
	sync()
	return nil
}

func NewMySQL(conn *sql.DB) error {
	a, err := sqladapter.NewAdapter(conn, "mysql", "casbin_rule_g")
	if err != nil {
		return err
	}
	m, err := model.NewModelFromString(modelText)
	if err != nil {
		return err
	}
	//enforcer, err := casbin.NewEnforcer(m, a)
	//if err != nil {
	//	return err
	//}

	//casbinInstance = enforcer
	//return nil
	return new(m, a)
}

func NewMongo(opt *options.ClientOptions, dbName string, collectionName string) error {
	a, err := mongodbadapter.NewAdapterWithCollectionName(opt, dbName, collectionName)
	if err != nil {
		return err
	}
	m, err := model.NewModelFromString(modelText)
	if err != nil {
		return err
	}

	return new(m, a)
}

func NewFile(filePath string) error {
	if casbinInstance != nil {
		return nil
	}
	m, err := model.NewModelFromString(modelText)
	if err != nil {
		return err
	}
	//enforcer, err := casbin.NewEnforcer(m, filePath)
	//if err != nil {
	//	return err
	//}
	//casbinInstance = enforcer
	//return nil
	return new(m, filePath)
}

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

func genPolicy(roleID, resourceID, permission string) []string {
	return []string{
		roleID,
		resourceID,
		permission,
	}
}

// sync casbinインスタンスとDBの差異を解消するために同期する
func sync() {
	if casbinInstance == nil {
		return
	}
	now := time.Now().Unix()
	if syncedTime+constant.CASBIN_SYNC_INTERVAL_MSEC > now {
		if err := casbinInstance.LoadPolicy(); err != nil {
			logging.GetDefaultLogger().Error(err)
		}
		syncedTime = now
	}
}

// listPolicies policy structure is [roleID, resourceID, permission] all string. this func return type policy slice
func listPolicies(roleID string) [][]string {
	var policies [][]string
	if roleID == "" {
		policies = casbinInstance.GetPolicy()
	} else {
		policies = casbinInstance.GetFilteredPolicy(0, roleID)
	}
	return policies
}

// method2Permissions APIメソッドをPermissionに変換
func method2Permissions(method string) []string {
	return permissionMap[method]
}

// listRoles ロール一覧を取得
func listRoles(userID string) []string {
	roles, err := casbinInstance.GetRolesForUser(userID)
	if err != nil {
		log.Errorf("listRoles -> %+v\n", err)
		return []string{}
	}
	return roles
}

// listUser 指定したロールを持つユーザーの一覧を取得
func listUsers(roleID string) []string {
	userIDs, err := casbinInstance.GetUsersForRole(roleID)
	if err != nil {
		return []string{}
	}
	return userIDs
}

// AddRoleForUser ユーザーにロールを付与する
func AddRoleForUser(userID, roleID string) bool {
	ok, err := casbinInstance.AddRoleForUser(userID, roleID)
	if err != nil {
		log.Errorf("DEBUG AddRoleForUser %+v\n", err)
	}
	return ok && err == nil
}

// updateRolesForUser ユーザーのロールを更新する
func updateRolesForUser(userID string, roleIDs []string) {
	RevokeRoleForUser(userID, "")
	for _, roleID := range roleIDs {
		AddRoleForUser(userID, roleID)
	}

}

// RevekeRoleForUser ユーザーからロールを剥奪する
func RevokeRoleForUser(userID, roleID string) bool {
	var ok bool
	var err error
	if roleID == "" {
		ok, err = casbinInstance.DeleteUser(userID)
		if err != nil {
			log.Errorf("DEBUG RevokeRoleForUser(%s) %+v\n", userID, err)
		}
	} else {
		ok, err = casbinInstance.DeleteRoleForUser(userID, roleID)
		if err != nil {
			log.Errorf("DEBUG RevokeRoleForUser(%s,%s) %+v\n", userID, roleID, err)
		}
	}
	return ok && err == nil
}

// RevekePermissionForRole ロールから権限を剥奪する
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

// UpdatePermissionsForRole ロールの権限を更新する
func UpdatePermissionsForRole(roleID string, permissions []*AdminRolePermission) *errors.VironError {
	policies := [][]string{}
	for _, permission := range permissions {
		policies = append(policies, genPolicy(roleID, permission.ResourceID, permission.Permission))
	}

	if _, err := removeRole(roleID); err != nil {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("removeRole %+v", err))
	}
	if _, err := casbinInstance.AddPolicies(policies); err != nil {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("AddPolicies(%+v) %+v", policies, err))
	}

	return nil
}

// removeRole ロールを削除する
func removeRole(roleID string) (bool, error) {
	ok, err := casbinInstance.DeleteRole(roleID)
	return ok, err
}

// hasPermissionByResourceID idがリソースを操作する権限を持っているかチェック
func hasPermissionByResourceID(id, resourceID string, permissions []string) bool {

	log.Debug("hasPermissionByResourceID called")
	for _, permission := range permissions {
		if ok, err := casbinInstance.Enforce(id, resourceID, permission); err != nil {
			log.Debugf("Enforce %+v", err)
		} else if ok {
			return true
		}
	}
	log.Debugf("no Permission %s %s %+v", id, resourceID, permissions)
	return false
}

// ListResourcesByOas resource一覧
func ListResourcesByOas(apiDef *openapi3.T) []string {

	extentions := helpers.ConvertExtentions(apiDef)
	resources := []string{}
	if extentions != nil {
		if len(extentions.XPages) > 0 {
			for _, page := range extentions.XPages {
				for _, content := range page.Contents {
					resources = append(resources, content.ResourceID)
				}
			}
		}
	}

	return resources
}

// ListByOas 管理ロール一覧
func ListByOas(apiDef *openapi3.T) *AdminRolesWithPager {

	policies := listPolicies("")
	log.Debugf("policies=%+v", policies)

	resources := ListResourcesByOas(apiDef)
	log.Debugf("resources=%+v", resources)

	policyMap := map[string]map[string]string{}
	for _, policy := range policies {
		if _, exists := policyMap[policy[0]]; !exists {
			policyMap[policy[0]] = map[string]string{}
		}
		if len(policy) != 3 || len(policy[2]) == 0 {
			policyMap[policy[0]][policy[1]] = constant.PERMISSION_DENY
		} else {
			policyMap[policy[0]][policy[1]] = policy[2]
		}
	}

	log.Debugf("policyMap=%+v", policyMap)

	result := []*AdminRole{}
	for roleID, _ := range policyMap {
		role := &AdminRole{
			ID:          roleID,
			Permissions: []*AdminRolePermission{},
		}
		for _, resourceID := range resources {
			permission, exists := policyMap[roleID][resourceID]
			if !exists {
				permission = constant.PERMISSION_DENY
			}
			adminRolePermission := &AdminRolePermission{
				ResourceID: resourceID,
				Permission: permission,
			}
			role.Permissions = append(role.Permissions, adminRolePermission)
		}
		result = append(result, role)
	}

	//helpers.Paging(result, len(result), constant.DEFAULT_PAGER_PAGE)
	pager := &AdminRolesWithPager{
		List: result,
	}
	pager.Pager = Pagging(len(result), len(result), constant.DEFAULT_PAGER_PAGE)
	return pager

}

// CreateViewerRole viewerロールを作成
func CreateViewerRole(apiDef *openapi3.T) error {
	policies := listPolicies(constant.ADMIN_ROLE_VIEWER)
	resourceIDs := ListResourcesByOas(apiDef)
	if len(policies) == len(resourceIDs) {
		// 更新するものがない
		log.Debug("len(policies) == len(resourceIDs)")
		return nil
	}

	policyMap := map[string]string{}
	for _, policy := range policies {
		// map[resourceID]=permission
		policyMap[policy[1]] = policy[2]
	}

	permissions := []*AdminRolePermission{}

	for _, resourceID := range resourceIDs {
		if _, exists := policyMap[resourceID]; exists {
			permissions = append(permissions, &AdminRolePermission{
				ResourceID: resourceID,
				Permission: policyMap[resourceID],
			})
		} else {
			permissions = append(permissions, &AdminRolePermission{
				ResourceID: resourceID,
				Permission: constant.PERMISSION_READ,
			})
		}
	}
	if err := UpdatePermissionsForRole(constant.ADMIN_ROLE_VIEWER, permissions); err != nil {
		return err
	}
	return nil
}

// CreateAdminRoleOne 1件作成
func CreateAdminRoleOne(role *AdminRole) (*AdminRole, *errors.VironError) {
	policies := listPolicies(role.ID)
	if len(policies) > 0 {
		return nil, errors.AdminRoleExists
	}

	if err := UpdatePermissionsForRole(role.ID, role.Permissions); err != nil {
		return nil, err
	}
	return role, nil
}

// RemoveAdminRoleOne IDで1件削除
func RemoveAdminRoleOne(roleID string) *errors.VironError {
	if ok, err := removeRole(roleID); !ok {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("removeRole %+v", err))
	}
	return nil
}

// UpdateAdminRoleByID IDで1件更新
func UpdateAdminRoleByID(roleID string, permissions []*AdminRolePermission) *errors.VironError {
	return UpdatePermissionsForRole(roleID, permissions)
}
