package authconfigs

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/getkin/kin-openapi/openapi3"

	"github.com/cam-inc/viron/packages/golang/config"
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/domains"
)

type (
	authConfigs struct {
		configOIDC         *config.OIDC
		configGoogleOAuth2 *config.GoogleOAuth2
	}
	authConfigResponse struct {
		List []*domains.AuthConfig `json:"list"`
		Oas  *openapi3.T           `json:"oas"`
	}
)

func New(google *config.GoogleOAuth2, oidc *config.OIDC) ServerInterface {
	return &authConfigs{
		configOIDC:         oidc,
		configGoogleOAuth2: google,
	}
}

func (a *authConfigs) ListVironAuthconfigs(w http.ResponseWriter, r *http.Request) {

	ctx := r.Context()
	apiDefCtx := ctx.Value(constant.CTX_KEY_API_DEFINITION)
	if apiDefCtx == nil {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("api-definition notfound"))
		return
	}

	// oasのcloneを作成
	list := []*domains.AuthConfig{}
	paths := map[string]*openapi3.PathItem{}
	apiDef := apiDefCtx.(*openapi3.T)
	clone := &openapi3.T{}
	if buf, err := json.Marshal(apiDef); err != nil {
		helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("api-definition notfound"))
	} else {
		if err := json.Unmarshal(buf, clone); err != nil {
			helpers.SendError(w, http.StatusInternalServerError, fmt.Errorf("api-definition notfound"))
		}
	}

	// emailのauthconfig
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_VIRON,
		constant.AUTH_TYPE_EMAIL,
		http.MethodPost,
		constant.EMAIL_SIGNIN_PATH,
		clone,
		nil,
		nil,
	); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.EMAIL_SIGNIN_PATH] = pathItem
	}

	// oidcのauthconfig
	if a.configOIDC != nil {
		if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SSO,
			constant.AUTH_CONFIG_TYPE_OIDC,
			http.MethodGet,
			constant.OIDC_AUTHORIZATION_PATH,
			clone,
			&map[string]interface{}{
				"clientId": a.configOIDC.ClientID,
			},
			&map[string]interface{}{
				"clientId": a.configOIDC.ClientID,
			},
		); err != nil {
			helpers.SendError(w, err.StatusCode(), err)
			return
		} else {
			list = append(list, r)
			paths[constant.OIDC_AUTHORIZATION_PATH] = pathItem
		}
		if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SSO,
			constant.AUTH_CONFIG_TYPE_OIDC_CALLBACK,
			http.MethodPost,
			constant.OIDC_CALLBACK_PATH,
			clone,
			&map[string]interface{}{
				"clientId": a.configOIDC.ClientID,
			},
			&map[string]interface{}{
				"clientId": a.configOIDC.ClientID,
			},
		); err != nil {
			helpers.SendError(w, err.StatusCode(), err)
			return
		} else {
			list = append(list, r)
			paths[constant.OIDC_CALLBACK_PATH] = pathItem
		}
	}

	// google oauth2のauthconfig
	if a.configGoogleOAuth2 != nil {
		if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SSO,
			constant.AUTH_CONFIG_TYPE_OAUTH,
			http.MethodGet,
			constant.GOOGLE_OAUTH2_AUTHORIZATION_PATH,
			clone,
			&map[string]interface{}{
				"clientId": a.configGoogleOAuth2.ClientID,
			},
			&map[string]interface{}{
				"clientId": a.configGoogleOAuth2.ClientID,
			},
		); err != nil {
			helpers.SendError(w, err.StatusCode(), err)
			return
		} else {
			list = append(list, r)
			paths[constant.GOOGLE_OAUTH2_AUTHORIZATION_PATH] = pathItem
		}
		if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SSO,
			constant.AUTH_CONFIG_TYPE_OAUTH_CALLBACK,
			http.MethodPost,
			constant.GOOGLE_OAUTH2_CALLBACK_PATH,
			clone,
			&map[string]interface{}{
				"clientId": a.configGoogleOAuth2.ClientID,
			},
			&map[string]interface{}{
				"clientId": a.configGoogleOAuth2.ClientID,
			},
		); err != nil {
			helpers.SendError(w, err.StatusCode(), err)
			return
		} else {
			list = append(list, r)
			paths[constant.GOOGLE_OAUTH2_CALLBACK_PATH] = pathItem
		}
	}

	// signoutのauthconfig
	if r, pathItem, err := domains.GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_SIGNOUT,
		constant.AUTH_CONFIG_TYPE_SIGNOUT,
		http.MethodPost,
		constant.SIGNOUT_PATH,
		clone, nil, nil); err != nil {
		helpers.SendError(w, err.StatusCode(), err)
		return
	} else {
		list = append(list, r)
		paths[constant.SIGNOUT_PATH] = pathItem
	}

	extentions := helpers.ConvertExtentions(clone)
	clone.Extensions[constant.OAS_X_PAGES] = extentions.XPages
	res := &authConfigResponse{
		List: list,
		Oas: &openapi3.T{
			OpenAPI:    clone.OpenAPI,
			Info:       clone.Info,
			Components: clone.Components,
			Paths:      paths,
		},
	}

	helpers.Send(w, http.StatusOK, res)
}
