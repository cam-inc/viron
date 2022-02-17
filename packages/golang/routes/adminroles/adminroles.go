package adminroles

import (
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/errors"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
	"github.com/getkin/kin-openapi/openapi3"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
)

type (
	adminroleImpl struct{}
)

/*






// リソース一覧(enum用)
export const listVironResourceIds = async (
  context: RouteContext
): Promise<void> => {
  const resouceIds = domainsAdminRole.listResourcesByOas(
    context.req._context.apiDefinition
  );
  context.res.json(resouceIds);
};

*/

var (
	permissions = []VironAdminRolePermissionPermission{
		VironAdminRolePermissionPermissionDeny,
		VironAdminRolePermissionPermissionRead,
		VironAdminRolePermissionPermissionWrite,
	}
)

func toVironAdminRoleSchema(role *domains.AdminRole) VironAdminRole {
	s := VironAdminRole{
		Id:          role.ID,
		Permissions: []VironAdminRolePermission{},
	}
	for _, permission := range role.Permissions {
		vironPermission := VironAdminRolePermission{
			ResourceId: permission.ResourceID,
		}
		for _, p := range permissions {
			if string(p) == permission.Permission {
				vironPermission.Permission = p
			}
		}
		s.Permissions = append(s.Permissions, vironPermission)
	}
	return s
}

func toVironAdminRolePermissionDomain(permissions []VironAdminRolePermission) []*domains.AdminRolePermission {
	d := []*domains.AdminRolePermission{}
	for _, p := range permissions {
		d = append(d, &domains.AdminRolePermission{
			ResourceID: p.ResourceId,
			Permission: string(p.Permission),
		})
	}
	return d
}

func (params ListVironAdminRolesParams) page() int {
	if params.Page == nil {
		return constant.DEFAULT_PAGER_PAGE
	}
	return params.Page.Page()
}
func (params ListVironAdminRolesParams) size() int {
	if params.Size == nil {
		return constant.DEFAULT_PAGER_SIZE
	}
	return params.Size.Size()
}

// ListVironAdminRoles 管理ロール一覧
func (a *adminroleImpl) ListVironAdminRoles(w http.ResponseWriter, r *http.Request, params ListVironAdminRolesParams) {
	ctxApiDef := r.Context().Value(constant.CTX_KEY_API_DEFINITION)
	apiDef, exists := ctxApiDef.(*openapi3.T)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf(`{"code":%d,"message":"notfound api-definition in ctx"}`, http.StatusInternalServerError))
		return
	}
	result := domains.ListByOas(apiDef, params.page(), params.size())
	if result == nil {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf(`{"code":%d,"message":"notfound roles"}`, http.StatusInternalServerError))
		return
	}

	helpers.Send(w, http.StatusOK, result)

}

func (a *adminroleImpl) CreateVironAdminRole(w http.ResponseWriter, r *http.Request) {
	role := &domains.AdminRole{}
	if err := helpers.BodyDecode(r, role); err != nil {
		helpers.SendError(w, errors.RequestBodyDecodeFailed.StatusCode(), errors.RequestBodyDecodeFailed)
		return
	}
	resultRole, err := domains.CreateAdminRoleOne(role)
	if err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}

	vironAdminRole := toVironAdminRoleSchema(resultRole)
	helpers.Send(w, http.StatusCreated, vironAdminRole)
}

func (a *adminroleImpl) RemoveVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {

	if err := domains.RemoveAdminRoleOne(string(id)); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}
	helpers.Send(w, http.StatusNoContent, nil)
}

func (a *adminroleImpl) UpdateVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {

	payload := VironAdminRoleUpdatePayload{}
	if err := helpers.BodyDecode(r, &payload); err != nil {
		helpers.SendError(w, errors.RequestBodyDecodeFailed.StatusCode(), errors.RequestBodyDecodeFailed)
		return
	}
	perm := toVironAdminRolePermissionDomain(payload.Permissions)
	if len(perm) > 0 {
		if err := domains.UpdateAdminRoleByID(string(id), perm); err != nil {
			helpers.SendError(w, err.StatusCode(), err)
			return
		}
	}
	helpers.Send(w, http.StatusNoContent, nil)
}

func New() ServerInterface {
	return &adminroleImpl{}
}
