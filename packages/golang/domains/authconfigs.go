package domains

import (
	"encoding/json"
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

func GenAuthConfig(
	provider string,
	authConfigType string,
	method string,
	path string,
	apiDef *openapi3.T,
	xDefaultParameters *map[string]interface{},
	xDefaultRequestBody *map[string]interface{},
) (*AuthConfig, *openapi3.PathItem, *errors.VironError) {

	// PathItem の取得
	pathItem, ok := apiDef.Paths[path]
	if !ok {
		fmt.Println("Path not found:", path)
		return nil, nil, errors.OasUndefined
	}

	// Operation の取得
	ope := pathItem.GetOperation(method)
	if ope == nil {
		fmt.Println("Operation not found for method:", method)
		return nil, nil, errors.OasUndefined
	}

	defaultParameters := mergeDefaultValues(ope.Extensions, constant.OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS, xDefaultParameters)
	defaultRequestBody := mergeDefaultValues(ope.Extensions, constant.OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY, xDefaultRequestBody)

	// ✅ 正常な AuthConfig を返却
	return &AuthConfig{
			Provider:                provider,
			AuthConfigType:          authConfigType,
			OperationID:             helpers.UpperCamelToLowerCamel(ope.OperationID),
			DefaultParametersValue:  defaultParameters,
			DefaultRequestBodyValue: defaultRequestBody,
		},
		pathItem,
		nil
}

func mergeDefaultValues(
	extensions map[string]interface{},
	key string,
	targetValues *map[string]interface{},
) *map[string]interface{} {
	if raw, ok := extensions[key].(json.RawMessage); ok {
		var configMap map[string]interface{}

		// JSON をデコード
		if err := json.Unmarshal(raw, &configMap); err != nil {
			fmt.Printf("❌ Error decoding %s JSON: %v\n", key, err)
			return targetValues // エラー時は既存の `existingConfig` をそのまま返す
		}

		// **マージ処理**
		if targetValues == nil {
			targetValues = &map[string]interface{}{}
		}

		for key, value := range configMap {
			(*targetValues)[key] = value
		}

		return targetValues
	}

	return targetValues // データがなければそのまま返す
}
