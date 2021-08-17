package adminaccounts

import (
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"

	externalRef0 "github.com/cam-inc/viron/packages/golang/routes/components"
)

type (
	adminaccountsImpl struct{}
)

func (a *adminaccountsImpl) ListVironAdminAccounts(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
	if ctxUser == nil {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}
	user, exists := ctxUser.(*domains.AdminUser)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, errors.AdminUserNotfound)
		return
	}
	pager, err := domains.ListAdminUser(r.Context(), &domains.AdminUserConditions{ID: user.ID})
	if err != nil {
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}
	helpers.Send(w, http.StatusOK, pager)
}

func (a *adminaccountsImpl) UpdateVironAdminAccount(w http.ResponseWriter, r *http.Request, id externalRef0.VironIdPathParam) {
	ctx := r.Context()
	log := logging.GetDefaultLogger()
	ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
	if ctxUser == nil {
		helpers.SendError(w, errors.AdminUserNotfound.StatusCode(), errors.AdminUserNotfound)
		return
	}
	user, exists := ctxUser.(*domains.AdminUser)
	if !exists {
		helpers.SendError(w, errors.AdminUserNotfound.StatusCode(), errors.AdminUserNotfound)
		return
	}

	if string(id) != fmt.Sprintf("%d", user.ID) {
		helpers.SendError(w, http.StatusForbidden, errors.Forbidden)
		return
	}

	payload := &VironAdminAccountUpdatePayload{}
	if err := helpers.BodyDecode(r, payload); err != nil {
		log.Errorf("bodyDecode %+v", err)
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}

	if err := domains.UpdateAccountByID(ctx, string(id), &domains.AdminAccount{Password: &payload.Password}); err != nil {
		log.Errorf("updateAccountById %+v", err)
		helpers.SendError(w, http.StatusInternalServerError, err)
		return
	}
	helpers.Send(w, http.StatusNoContent, nil)
}

func New() ServerInterface {
	return &adminaccountsImpl{}
}
