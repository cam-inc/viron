package authconfigs

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/cam-inc/viron/packages/golang/domains"
)

type (
	authConfigs        struct{}
	authConfigResponse struct {
		List []*domains.AuthConfig `json:"list"`
		Oas  *openapi3.T           `json:"oas"`
	}
)

func (a *authConfigs) ListVironAuthconfigs(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	apiDefCtx := ctx.Value(constant.CTX_KEY_API_DEFINITION)
	if apiDefCtx == nil {
		// ?
		helpers.SendError(w, 400, fmt.Errorf("DAMEEEEE"))
		return
	}

	list := []*domains.AuthConfig{}
	paths := map[string]*openapi3.PathItem{}
	apiDef := apiDefCtx.(*openapi3.T)
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_VIRON,
		constant.AUTH_TYPE_EMAIL,
		http.MethodPost,
		constant.EMAIL_SIGNIN_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.EMAIL_SIGNIN_PATH] = pathItem
	}
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_GOOGLE,
		constant.AUTH_CONFIG_TYPE_OAUTH,
		http.MethodGet,
		constant.OAUTH2_GOOGLE_AUTHORIZATION_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.OAUTH2_GOOGLE_AUTHORIZATION_PATH] = pathItem
	}
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_GOOGLE,
		constant.AUTH_CONFIG_TYPE_OAUTH_CALLBACK,
		http.MethodPost,
		constant.OAUTH2_GOOGLE_CALLBACK_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.OAUTH2_GOOGLE_CALLBACK_PATH] = pathItem
	}
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SIGNOUT,
		constant.AUTH_CONFIG_TYPE_SIGNOUT,
		http.MethodPost,
		constant.SIGNOUT_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.SIGNOUT_PATH] = pathItem
	}

	res := &authConfigResponse{
		List: list,
		Oas: &openapi3.T{
			OpenAPI:    apiDef.OpenAPI,
			Info:       apiDef.Info,
			Components: apiDef.Components,
			Paths:      paths,
		},
	}

	response, _ := json.Marshal(res)
	fmt.Fprintln(w, string(response))

}

func New() ServerInterface {
	return &authConfigs{}
}
