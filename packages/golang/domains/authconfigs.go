package domains

import (
	"fmt"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/errors"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/openapi3"
)

type (
	AuthConfig struct {
		Provider                string      `json:"provider"`
		AuthConfigType          string      `json:"type"`
		OperationID             string      `json:"operationId"`
		DefaultParametersValue  interface{} `json:"defaultParametersValue,omitempty"`
		DefaultRequestBodyValue interface{} `json:"defaultRequestBodyValue,omitempty"`
	}
)

func GenAuthConfig(provider string, authConfigType string, method string, path string, apiDef *openapi3.T) (*AuthConfig, *openapi3.PathItem, *errors.VironError) {

	pathItem, ok := apiDef.Paths[path]
	if !ok {
		return nil, nil, errors.OasUndefined
	}

	ope := pathItem.GetOperation(method)
	if ope == nil {
		return nil, nil, errors.OasUndefined
	}
	xDefautlParameters, ok := ope.Extensions[constant.OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS]
	if !ok {
		fmt.Println("xDefautlParameters not found")
	}
	xDefautlRequestBody, ok := ope.Extensions[constant.OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY]
	if !ok {
		fmt.Println("xDefautlRequestBody not found")
	}

	return &AuthConfig{
			Provider:                provider,
			AuthConfigType:          authConfigType,
			OperationID:             helpers.UpperCamelToLowerCamel(ope.OperationID),
			DefaultParametersValue:  xDefautlParameters,
			DefaultRequestBodyValue: xDefautlRequestBody,
		},
		pathItem,
		nil
}
