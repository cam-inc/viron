package domains

import (
	"encoding/json"
	"strings"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/jsoninfo"
	"github.com/getkin/kin-openapi/openapi3"
	pathToRegexp "github.com/soongo/path-to-regexp"
)

type (
	pathMethod struct {
		path   string
		method string
	}

	operationIDPathMethodMap map[string]*pathMethod

	Action struct {
		OperationID string `json:"operationId"`
	}

	Content struct {
		OperationID string    `json:"operationId"`
		Query       []string  `json:"query,omitempty"`
		Sort        []string  `json:"sort,omitempty"`
		ResourceID  string    `json:"resourceId"`
		ContentType string    `json:"type"`
		Actions     []*Action `json:"actions"`
	}
	XPages struct {
		ID          string     `json:"ID"`
		Title       string     `json:"title"`
		Group       string     `json:"group"`
		Description string     `json:"description"`
		Contents    []*Content `json:"contents"`
	}
)

// GetOas ロールに沿ったoasを返す
func GetOas(apiDef *openapi3.T, roleIDs []string) *openapi3.T {
	log := logging.GetDefaultLogger()
	clone := &openapi3.T{}
	if buf, err := json.Marshal(apiDef); err != nil {
		return nil
	} else {
		if err := json.Unmarshal(buf, clone); err != nil {
			return nil
		}
	}

	log.Debugf("roleIDs %+v", roleIDs)

	if err := CreateViewerRole(clone); err != nil {
		log.Errorf("CreateViewerRole error(%+v)", err)
	}

	extentions := helpers.ConvertExtentions(clone)
	rewritedPages := []*helpers.XPage{}
	for _, page := range extentions.XPages {
		granted := []*helpers.XContent{}
		for _, content := range page.Contents {
			pathMethod := findPathMethodByOperationID(content.OperationID, clone)
			if pathMethod == nil || pathMethod.method == "" {
				continue
			}

			log.Debugf("findPathMethodByOperationID %+v", pathMethod)

			for _, roleID := range roleIDs {
				log.Debugf("roleId %s resourceId %s method2Permissions(pathMethod.method) %+v", roleID, content.ResourceID, method2Permissions(pathMethod.method))
				if hasPermissionByResourceID(roleID, content.ResourceID, method2Permissions(pathMethod.method)) {
					granted = append(granted, content)
				}
			}

		}
		log.Debugf("granted %+v", granted)

		if len(granted) > 0 {
			page.Contents = granted
			rewritedPages = append(rewritedPages, page)
		}
	}

	log.Debugf("rewritedPages %+v", rewritedPages)

	clone.Info.Extensions[constant.OAS_X_PAGES] = rewritedPages
	return clone
}

// getPathItem uriにヒットするとpathとpathItemをoasから取得する
func getPathItem(uri string, apiDef *openapi3.T) *openapi3.PathItem {
	for path, pathItem := range apiDef.Paths {
		match, err := pathToRegexp.Match(path, nil)
		if err != nil {
			continue
		}
		if result, err := match(uri); result != nil && err == nil {
			return pathItem
		}
	}
	return nil
}

// findOperationID uri,methodに対応するopeartionIdを取得
func findOperationID(uri, method string, apiDef *openapi3.T) string {
	pathItem := getPathItem(uri, apiDef)
	if pathItem == nil {
		return ""
	}
	operation := pathItem.GetOperation(helpers.MethodNameUpper(method))
	if operation == nil {
		return ""
	}
	return operation.OperationID
}

// listContentByOas oasのx-pages内のcontentsを一覧取得
func listContentsByOas(apiDef *openapi3.T) []*Content {
	contents := []*Content{}
	if apiDef.Info == nil || len(apiDef.Info.Extensions) == 0 {
		return contents
	}

	prop := &openapi3.ExtensionProps{
		Extensions: map[string]interface{}{
			constant.OAS_X_PAGES: apiDef.Info.ExtensionProps.Extensions[constant.OAS_X_PAGES],
		},
	}
	xPages := &XPages{
		Contents: []*Content{},
	}
	if err := prop.EncodeWith(jsoninfo.NewObjectEncoder(), xPages); err != nil {
		return contents
	}
	for _, c := range xPages.Contents {
		contents = append(contents, c)
	}
	return contents
}

// findResourceID x-pagesからoperationIdを取得
func findResourceID(operationID string, apiDef *openapi3.T) string {
	contents := listContentsByOas(apiDef)
	for _, c := range contents {
		if c.OperationID == operationID {
			return c.ResourceID
		}
	}
	return ""
}

func genOperationIDPathMethodMap(apiDef *openapi3.T) operationIDPathMethodMap {
	oMap := operationIDPathMethodMap{}
	for path, pathItem := range apiDef.Paths {
		for _, method := range constant.API_METHODS {
			ope := pathItem.GetOperation(helpers.MethodNameUpper(method))
			if ope == nil {
				continue
			}
			oMap[ope.OperationID] = &pathMethod{
				path:   path,
				method: method,
			}
		}
	}
	return oMap
}

// findPathMethodByOperationID operationIdからpathとmethodを逆引き
func findPathMethodByOperationID(operationID string, apiDef *openapi3.T) *pathMethod {
	oMap := genOperationIDPathMethodMap(apiDef)
	pm, ok := oMap[operationID]
	if !ok {
		return nil
	}
	return pm
}

// findResourceIDByActions uri,methodをactionsに持つcontentのresourceIdを取得
func findResourceIDByActions(uri, method string, apiDef *openapi3.T) string {
	contents := listContentsByOas(apiDef)
	for _, c := range contents {
		if len(c.Actions) == 0 {
			continue
		}
		for _, a := range c.Actions {
			pm := findPathMethodByOperationID(a.OperationID, apiDef)
			if pm.method == method {
				match, err := pathToRegexp.Match(pm.path, nil)
				if err != nil {
					continue
				}
				if result, err := match(uri); result != nil && err == nil {
					return c.ResourceID
				}
			}
		}
	}
	return ""
}

func getResourceID(uri, method string, apiDef *openapi3.T) string {
	operationID := findOperationID(uri, method, apiDef)
	if operationID == "" {
		return ""
	}
	resourceID := findResourceID(operationID, apiDef)
	if resourceID != "" {
		return resourceID
	}

	parentUri := uri
	parentLastIndex := strings.LastIndex(parentUri, "/")
	for {
		parentUri := parentUri[0:parentLastIndex]
		for _, method := range constant.API_METHODS {
			oid := findOperationID(parentUri, method, apiDef)
			if oid == "" {
				continue
			}
			rid := findResourceID(oid, apiDef)
			if rid != "" {
				return rid
			}
		}
		parentLastIndex = strings.LastIndex(parentUri, "/")
		if parentLastIndex == 0 {
			break
		}
	}

	if actionResourceID := findResourceIDByActions(uri, method, apiDef); actionResourceID != "" {
		return actionResourceID
	}

	return ""

}
