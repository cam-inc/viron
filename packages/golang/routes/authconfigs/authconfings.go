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
	authConfigs struct{}
)

func (a *authConfigs) ListVironAuthconfigs(w http.ResponseWriter, r *http.Request) {
	//panic("implement me")
	/*
	    genAuthConfig(
	      AUTH_CONFIG_PROVIDER.VIRON,
	      AUTH_CONFIG_TYPE.EMAIL,
	      API_METHOD.POST,
	      EMAIL_SIGNIN_PATH,
	      context.req._context.apiDefinition
	    ),
	    genAuthConfig(
	      AUTH_CONFIG_PROVIDER.GOOGLE,
	      AUTH_CONFIG_TYPE.OAUTH,
	      API_METHOD.GET,
	      OAUTH2_GOOGLE_AUTHORIZATION_PATH,
	      context.req._context.apiDefinition
	    ),
	    genAuthConfig(
	      AUTH_CONFIG_PROVIDER.GOOGLE,
	      AUTH_CONFIG_TYPE.OAUTH_CALLBACK,
	      API_METHOD.POST,
	      OAUTH2_GOOGLE_CALLBACK_PATH,
	      context.req._context.apiDefinition
	    ),
	    genAuthConfig(
	      AUTH_CONFIG_PROVIDER.SIGNOUT,
	      AUTH_CONFIG_TYPE.SIGNOUT,
	      API_METHOD.POST,
	      SIGNOUT_PATH,
	      context.req._context.apiDefinition
	    ),
	  ];
	*/
	ctx := r.Context()
	apiDefCtx := ctx.Value(constant.CTX_KEY_API_DEFINITION)
	if apiDefCtx == nil {
		// ?
		helpers.SendError(w, 400, fmt.Errorf("DAMEEEEE"))
		return
	}

	res := []*domains.AuthConfig{}
	apiDef := apiDefCtx.(*openapi3.T)
	if r, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_VIRON,
		constant.AUTH_TYPE_EMAIL,
		constant.API_METHOD_POST,
		constant.EMAIL_SIGNIN_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		res = append(res, r)
	}
	if r, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_GOOGLE,
		constant.AUTH_CONFIG_TYPE_OAUTH,
		constant.API_METHOD_GET,
		constant.OAUTH2_GOOGLE_AUTHORIZATION_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		res = append(res, r)
	}
	if r, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_GOOGLE,
		constant.AUTH_CONFIG_TYPE_OAUTH_CALLBACK,
		constant.API_METHOD_POST,
		constant.OAUTH2_GOOGLE_CALLBACK_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		res = append(res, r)
	}
	if r, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SIGNOUT,
		constant.AUTH_CONFIG_TYPE_SIGNOUT,
		constant.API_METHOD_POST,
		constant.SIGNOUT_PATH,
		apiDef); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		res = append(res, r)
	}

	page := helpers.Paging(res, len(res), constant.DEFAULT_PAGER_PAGE)

	response, _ := json.Marshal(page)
	fmt.Fprintln(w, string(response))

}

func New() ServerInterface {
	return &authConfigs{}
}
