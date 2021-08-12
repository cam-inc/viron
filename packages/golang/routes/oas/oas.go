package oas

import (
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/domains"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/getkin/kin-openapi/openapi3"
)

type oas struct{}

func (o *oas) GetOas(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	ctxApiDef := ctx.Value(constant.CTX_KEY_API_DEFINITION)
	apiDef, exists := ctxApiDef.(*openapi3.T)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("api-definition notfound"))
		return
	}
	ctxUser := ctx.Value(constant.CTX_KEY_ADMINUSER)
	user, exists := ctxUser.(*domains.AdminUser)
	if !exists {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("adminuser notfound"))
		return
	}
	clone := domains.GetOas(apiDef, user.RoleIDs)

	// DEBUG
	if v := ctx.Value(JwtScopes); v == nil {
		fmt.Println("jwtScopes is nil")
	} else {
		fmt.Println(v)
	}
	// DEBUG

	helpers.Send(w, http.StatusOK, clone)
}

func (o *oas) LoadOas() *openapi3.T {
	oas, _ := GetSwagger()
	return oas
}

func New() ServerInterface {
	return &oas{}
}
