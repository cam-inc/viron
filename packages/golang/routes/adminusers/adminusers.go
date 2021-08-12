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

	pager := PagerToVironAdminUserListWithPager(results.Page, results.MaxPage, results.List)

	helpers.Send(w, http.StatusOK, pager)

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

func PagerToVironAdminUserListWithPager(currentPage, maxPage int, users []*domains.AdminUser) VironAdminUserListWithPager {
	vironPager := VironAdminUserListWithPager{
		VironPager: externalRef0.VironPager{
			CurrentPage: currentPage,
			MaxPage:     maxPage,
		},
		List: VironAdminUserList{},
	}

	for i, adminUser := range users {
		vironPager.List = append(vironPager.List, VironAdminUser{
			AuthType: adminUser.AuthType,
			Email:    openapi_types.Email(adminUser.Email),
			Id:       fmt.Sprintf("%d", adminUser.ID),
			RoleIds:  &adminUser.RoleIDs,
		})

		createdAtInt64 := adminUser.CreatedAt.Unix()
		updatedAtInt64 := adminUser.UpdateAt.Unix()
		vironPager.List[i].CreatedAt = &createdAtInt64
		vironPager.List[i].UpdatedAt = &updatedAtInt64
	}

	return vironPager
}
