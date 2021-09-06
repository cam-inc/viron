package adminusers

import (
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/constant"

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
		conditions.ID = string(*params.Id)
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

	pager := PagerToVironAdminUserListWithPager(results.CurrentPage, results.MaxPage, results.List)

	helpers.Send(w, http.StatusOK, pager)

}

func (a *adminuser) CreateVironAdminUser(w http.ResponseWriter, r *http.Request) {

	payload := VironAdminUserCreatePayload{}
	if err := helpers.BodyDecode(r, &payload); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}
	user := &domains.AdminUser{
		Email:    string(payload.Email),
		Password: &payload.Password,
		AuthType: constant.AUTH_TYPE_EMAIL,
	}
	created, err := domains.CreateAdminUser(r.Context(), user, user.AuthType)
	if err != nil {
		fmt.Println(err)
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}
	helpers.Send(w, http.StatusCreated, created)

}

func (a *adminuser) RemoveVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	panic("implement me")
}

func (a *adminuser) UpdateVironAdminUser(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {

	log := logging.GetDefaultLogger()

	payload := VironAdminUserUpdatePayload{}
	if err := helpers.BodyDecode(r, &payload); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}

	user := &domains.AdminUser{
		Password: payload.Password,
	}
	if payload.RoleIds != nil {
		user.RoleIDs = *payload.RoleIds
	}

	log.Debugf("payload %+v", payload)

	if err := domains.UpdateAdminUserByID(r.Context(), string(id), user); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	}
	helpers.Send(w, http.StatusNoContent, nil)
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

	for _, adminUser := range users {
		vironPager.List = append(vironPager.List, VironAdminUser{
			AuthType:  adminUser.AuthType,
			Email:     openapi_types.Email(adminUser.Email),
			Id:        adminUser.ID,
			RoleIds:   &adminUser.RoleIDs,
			CreatedAt: &adminUser.CreatedAtInt,
			UpdatedAt: &adminUser.UpdateAtInt,
		})

		//createdAtInt64 := adminUser.CreatedAt.Unix()
		//updatedAtInt64 := adminUser.UpdateAt.Unix()
		//vironPager.List[i].CreatedAt = &createdAtInt64
		//vironPager.List[i].UpdatedAt = &updatedAtInt64
	}

	return vironPager
}
