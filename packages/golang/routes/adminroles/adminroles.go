package adminroles

import (
	"fmt"
	"net/http"

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

// 管理ロール作成
export const createVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  const result = await domainsAdminRole.createOne(context.requestBody);
  context.res.status(201).json(result);
};

// 管理ロール更新
export const updateVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminRole.updateOneById(
    context.params.path.id,
    context.requestBody.permissions
  );
  context.res.status(204).end();
};

// 管理ロール削除
export const removeVironAdminRole = async (
  context: RouteContext
): Promise<void> => {
  await domainsAdminRole.removeOneById(context.params.path.id);
  context.res.status(204).end();
};

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

func (a *adminroleImpl) ListVironAdminRoles(w http.ResponseWriter, r *http.Request) {
	ctxApiDef := r.Context().Value(constant.CTX_KEY_API_DEFINITION)
	apiDef, exists := ctxApiDef.(*openapi3.T)
	if !exists {
		fmt.Println("debug adminroles 1")
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf(`{"code":%d,"message":"notfound api-definition in ctx"}`, http.StatusInternalServerError))
		return
	}
	result := domains.ListByOas(apiDef)
	if result == nil {
		fmt.Println("debug adminroles 2")
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf(`{"code":%d,"message":"notfound roles"}`, http.StatusInternalServerError))
		return
	}

	helpers.Send(w, http.StatusOK, result)

}

func (a *adminroleImpl) CreateVironAdminRole(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (a *adminroleImpl) RemoveVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	panic("implement me")
}

func (a *adminroleImpl) UpdateVironAdminRole(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	panic("implement me")
}

func New() ServerInterface {
	return &adminroleImpl{}
}
