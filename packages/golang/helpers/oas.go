package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/imdario/mergo"

	"github.com/cam-inc/viron/packages/golang/constant"

	"github.com/getkin/kin-openapi/openapi3"
)

type (
	XContent struct {
		OperationID string   `json:"operationId"`
		ResourceID  string   `json:"resourceId"`
		Query       []string `json:"query"`
		ContentType string   `json:"type"`
		Sort        []string `json:"sort"`
	}
	XPage struct {
		ID          string      `json:"id"`
		Group       string      `json:"group"`
		Title       string      `json:"title"`
		Description string      `json:"description"`
		Contents    []*XContent `json:"contents"`
	}
	XTable struct {
		ResponseListKey string      `json:"responseListKey"`
		Pager           interface{} `json:"pager"`
		Sort            interface{} `json:"sort"`
	}
	XAutoComplete struct {
		ResponseLabelKey string `json:"responseLabelKey"`
		ResponseValueKey string `json:"responseValueKey"`
	}
	Extensions struct {
		XPages     []*XPage       `json:"x-pages"`
		XTable     *XTable        `json:"x-table"`
		XComplete  *XAutoComplete `json:"x-autocomplete"`
		XTheme     string         `json:"x-theme"`
		XThumbnail string         `json:"x-thumbnail"`
		XTags      []string       `json:"x-tags"`
	}
)

func ref(r string, org string, rep string) string {
	if strings.Contains(r, org) {
		return strings.Replace(r, org, rep, -1)
	}
	return r
}

func UpperCamelToLowerCamel(operationID string) string {
	if operationID == "" {
		return operationID
	}
	first := operationID[:1]
	lower := strings.ToLower(first)
	return strings.Replace(operationID, first, lower, 1)
}

func opeRef(ope *openapi3.Operation, org string, rep string) error {
	if ope.OperationID != "" {
		ope.OperationID = UpperCamelToLowerCamel(ope.OperationID)
	}
	if ope.RequestBody != nil {
		ope.RequestBody.Ref = ref(ope.RequestBody.Ref, org, rep)
	}
	for _, r := range ope.Responses {
		r.Ref = ref(r.Ref, org, rep)
	}
	for _, p := range ope.Parameters {
		p.Ref = ref(p.Ref, org, rep)
	}
	return nil
}

func Ref(docRoot *openapi3.T, org string, rep string) error {

	// paths
	for _, pathItem := range docRoot.Paths {
		pathItem.Ref = ref(pathItem.Ref, org, rep)
		if pathItem.Get != nil {
			if err := opeRef(pathItem.Get, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Post != nil {
			if err := opeRef(pathItem.Post, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Put != nil {
			if err := opeRef(pathItem.Put, org, rep); err != nil {
				return err
			}
		}
		if pathItem.Delete != nil {
			if err := opeRef(pathItem.Delete, org, rep); err != nil {
				return err
			}
		}
	}

	// components
	for _, param := range docRoot.Components.Parameters {
		param.Ref = ref(param.Ref, org, rep)
	}
	for _, schema := range docRoot.Components.Schemas {
		schema.Ref = ref(schema.Ref, org, rep)
		if schema.Value != nil {

			for _, oo := range schema.Value.OneOf {
				oo.Ref = ref(oo.Ref, org, rep)
			}
			for _, ao := range schema.Value.AllOf {
				ao.Ref = ref(ao.Ref, org, rep)
			}
			for _, any := range schema.Value.AnyOf {
				any.Ref = ref(any.Ref, org, rep)
			}
		}
	}
	for _, response := range docRoot.Components.Responses {
		response.Ref = ref(response.Ref, org, rep)
	}
	for _, link := range docRoot.Components.Links {
		link.Ref = ref(link.Ref, org, rep)
	}
	return nil
}

func MethodNameLower(method string) string {
	switch strings.ToLower(method) {
	case constant.API_METHOD_GET:
		return constant.API_METHOD_GET
	case constant.API_METHOD_POST:
		return constant.API_METHOD_POST
	case constant.API_METHOD_PUT:
		return constant.API_METHOD_PUT
	case constant.API_METHOD_DELETE:
		return constant.API_METHOD_DELETE
	}
	return ""
}

func MethodNameUpper(method string) string {
	switch strings.ToUpper(method) {
	case http.MethodGet:
		return http.MethodGet
	case http.MethodPost:
		return http.MethodPost
	case http.MethodPut:
		return http.MethodPut
	case http.MethodDelete:
		return http.MethodDelete
	}
	return ""

}

func OasMerge(dist *openapi3.T, src *openapi3.T) error {

	fmt.Println("--")

	if len(src.Security) > 0 {
		dist.Security = append(dist.Security, src.Security...)
	}

	fmt.Println("--")
	fmt.Printf("dist tags%+v, src tags%+v\n", dist.Tags, src.Tags)
	if len(src.Tags) > 0 {
		dist.Tags = append(dist.Tags, src.Tags...)
	}
	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Headers, src.Components.Headers); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Schemas, src.Components.Schemas); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Parameters, src.Components.Parameters); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Responses, src.Components.Responses); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.SecuritySchemes, src.Components.SecuritySchemes); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Links, src.Components.Links); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Callbacks, src.Components.Callbacks); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}
	fmt.Println("--")
	if err := mergo.Merge(&dist.Components.Examples, src.Components.Examples); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--")
	if err := mergo.Merge(&dist.Paths, src.Paths); err != nil {
		fmt.Printf("merge failed %v\n", err)
		return err
	}

	fmt.Println("--Extensions")
	if len(src.Info.Extensions) > 0 {

		srcEx := &Extensions{
			XPages:    []*XPage{},
			XComplete: &XAutoComplete{},
			XTable:    &XTable{},
		}

		srcJSONEx, _ := json.Marshal(src.Info.Extensions)
		fmt.Printf("src info Extensions %s\n", string(srcJSONEx))
		fmt.Printf("srcEx %v, %v, %v\n", srcEx.XPages, srcEx.XTable, srcEx.XComplete)
		fmt.Printf("xPages %d\n", len(srcEx.XPages))

		if err := json.Unmarshal(srcJSONEx, srcEx); err != nil {
			fmt.Printf("unmarshal err %v\n", err)
			return err
		} else {
			fmt.Println("unmarshal success")
			fmt.Printf("srcEx %v, %v, %v\n", srcEx.XPages, srcEx.XTable, srcEx.XComplete)

			distEx := &Extensions{
				XPages:    []*XPage{},
				XComplete: &XAutoComplete{},
				XTable:    &XTable{},
			}

			if len(dist.Info.Extensions) > 0 {
				distJSONEx, _ := json.Marshal(dist.Info.Extensions)
				if err := json.Unmarshal(distJSONEx, distEx); err != nil {
					fmt.Printf("dist json ex unmarshal err %v\n", err)
					return err
				}
			}

			if distEx.XComplete == nil || distEx.XComplete.ResponseLabelKey == "" {
				distEx.XComplete = srcEx.XComplete
			}
			if distEx.XTable == nil || distEx.XTable.ResponseListKey == "" {
				distEx.XTable = srcEx.XTable
			}
			if len(srcEx.XPages) > 0 {
				distEx.XPages = append(distEx.XPages, srcEx.XPages...)
			}
			if len(srcEx.XTags) > 0 {
				distEx.XTags = append(distEx.XTags, srcEx.XTags...)
			}
			if distEx.XTheme == "" && srcEx.XTheme != "" {
				distEx.XTheme = srcEx.XTheme
			}
			if distEx.XThumbnail == "" && srcEx.XThumbnail != "" {
				distEx.XThumbnail = srcEx.XThumbnail
			}

			if distJSONExFixies, err := json.Marshal(distEx); err == nil {
				distExtensions := map[string]interface{}{}
				if err := json.Unmarshal(distJSONExFixies, &distExtensions); err != nil {
					fmt.Printf("unmarshal failed%v\n", err)
					return err
				} else {
					dist.Info.Extensions = distExtensions
				}
			}

			fmt.Printf("dist.info.Extensions %+v\n", dist.Info.Extensions)
		}
	}

	debugJ, _ := json.Marshal(dist)
	fmt.Printf("debugJ %s\n", string(debugJ))

	fmt.Println("--")
	return nil
}

func ConvertExtentions(apiDef *openapi3.T) *Extensions {
	distEx := &Extensions{
		XPages:    []*XPage{},
		XComplete: &XAutoComplete{},
		XTable:    &XTable{},
	}

	if len(apiDef.Info.Extensions) > 0 {
		distJSONEx, _ := json.Marshal(apiDef.Info.Extensions)
		if err := json.Unmarshal(distJSONEx, distEx); err != nil {
			fmt.Printf("dist json ex unmarshal err %v\n", err)
			return nil
		}
	} else {
		return nil
	}
	return distEx
}

/*
func HasJWT(docRoot *openapi3.T) bool {
	for _, path := range docRoot.Paths {
		path.Get
	}
}
*/
