package adminusers

import (
	"fmt"
	"net/http"
	"strconv"

	openapi_types "github.com/deepmap/oapi-codegen/pkg/types"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/domains"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
)

type (
	adminuser struct{}
)

func (a *adminuser) ListVironAdminUsers(w http.ResponseWriter, r *http.Request, params ListVironAdminUsersParams) {
	/*
		// 管理ユーザー一覧
		export const listVironAdminUsers = async (
		  context: RouteContext
		): Promise<void> => {
		  const { size, page, sort, ...conditions } = context.params.query;
		  const result = await domainsAdminUser.list(conditions, size, page, sort);
		  context.res.json(result);
		};

	*/

	conditions := &domains.AdminUserConditions{}
	if params.Size != nil {
		conditions.Size = int(*params.Size)
	}
	if params.Page != nil {
		conditions.Page = int(*params.Page)
	}
	if params.Id != nil {
		paramID, _ := strconv.Atoi(string(*params.Id))
		conditions.ID = uint(paramID)
	}
	if params.Email != nil {
		conditions.Email = string(*params.Email)
	}
	if params.RoleId != nil {
		conditions.RoleID = string(*params.RoleId)
	}

	results, err := domains.ListAdminUser(r.Context(), conditions)

	if err != nil {
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}

	jresults := VironAdminUserListWithPager{
		VironPager: externalRef0.VironPager{
			CurrentPage: results.Page,
			MaxPage:     results.MaxPage,
		},
		List: VironAdminUserList{},
	}

	for i, r := range results.List {
		jresults.List = append(jresults.List, VironAdminUser{
			AuthType: r.AuthType,
			Email:    openapi_types.Email(r.Email),
			Id:       fmt.Sprintf("%d", r.ID),
			RoleIds:  &r.RoleIDs,
		})

		createdAtInt64 := r.CreatedAt.Unix()
		updatedAtInt64 := r.UpdateAt.Unix()
		jresults.List[i].CreatedAt = &createdAtInt64
		jresults.List[i].UpdatedAt = &updatedAtInt64
	}

	helpers.Send(w, http.StatusOK, jresults)

}

func (a *adminuser) CreateVironAdminUser(w http.ResponseWriter, r *http.Request) {
	panic("implement me")
}

func (a *adminuser) RemoveVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	panic("implement me")
}

func (a *adminuser) UpdateVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	panic("implement me")
}

func New() ServerInterface {
	return &adminuser{}
}
