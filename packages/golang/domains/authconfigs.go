package domains

import (
	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/getkin/kin-openapi/openapi3"
)

type (
	AuthConfig struct {
		Provider                string                                    `json:"provider"`
		AuthConfigType          string                                    `json:"type"`
		PathObject              map[string]map[string]*openapi3.Operation `json:"pathObject"`
		DefaultParametersValue  interface{}                               `json:"defaultParametersValue,omitempty"`
		DefaultRequestBodyValue interface{}                               `json:"defaultRequestBodyValue,omitempty"`
	}
)

func GenAuthConfig(provider string, authConfigType string, method string, path string, apiDef *openapi3.T) (*AuthConfig, *errors.VironError) {

	pathItem, ok := apiDef.Paths[path]
	if !ok {
		return nil, errors.OasUndefined
	}

	ope := pathItem.GetOperation(method)
	if ope == nil {
		return nil, errors.OasUndefined
	}
	xDefautlParameters, _ := ope.Extensions[constant.OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS]
	xDefautlRequestBody, _ := ope.Extensions[constant.OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY]

	return &AuthConfig{
		Provider:       provider,
		AuthConfigType: authConfigType,
		PathObject: map[string]map[string]*openapi3.Operation{
			path: map[string]*openapi3.Operation{
				method: ope,
			},
		},
		DefaultParametersValue:  xDefautlParameters,
		DefaultRequestBodyValue: xDefautlRequestBody,
	}, nil
}

/*
export interface AuthConfig {
  provider: AuthConfigProvider;
  type: AuthConfigType;
  pathObject: VironPathsObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultParametersValue?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultRequestBodyValue?: any;
}

export type AuthConfigs = AuthConfig[];

export const genAuthConfig = (
  provider: AuthConfigProvider,
  type: AuthConfigType,
  method: ApiMethod,
  path: string,
  apiDefinition: VironOpenAPIObject
): AuthConfig => {

};

*/
