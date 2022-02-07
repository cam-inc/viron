package domains

import (
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/cam-inc/viron/packages/golang/logging"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/openapi3"
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

	XPage struct {
		ID          string     `json:"id"`
		Title       string     `json:"title"`
		Group       string     `json:"group"`
		Description string     `json:"description"`
		Contents    []*Content `json:"contents"`
	}

	XPages []*XPage

	Permission struct {
		ResourceID   string
		OperationIDs []string
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

// ACLAllow ロールに沿ったAPIアクセス許可チェック
func ACLAllow(method, uri string, roleIDs []string, apiDef *openapi3.T) bool {

	log := logging.GetDefaultLogger()

	operationID := findOperationIDByPathMethod(method, uri, apiDef)
	if operationID == "" {
		log.Debugf("not operationID uri[%+v] method[%+v] roleIDs[%+v] apiDef[%+v]", uri, method, roleIDs, apiDef)
		return false
	}
	resourceID := findResourceID(operationID, apiDef)
	if resourceID == "" {
		log.Debugf("not resourceID uri[%+v] method[%+v] roleIDs[%+v] apiDef[%+v]", uri, method, roleIDs, apiDef)
		return false
	}
	pathMethod := findPathMethodByOperationID(operationID, apiDef)
	if pathMethod == nil {
		log.Debugf("not pathMethod uri[%+v] method[%+v] roleIDs[%+v] apiDef[%+v]", uri, method, roleIDs, apiDef)
		return false
	}

	for _, roleID := range roleIDs {
		if hasPermissionByResourceID(roleID, resourceID, method2Permissions(pathMethod.method)) {
			return true
		}
	}

	log.Debugf("not permission uri[%+v] method[%+v] roleIDs[%+v] apiDef[%+v]", uri, method, roleIDs, apiDef)
	return false
}

// listContentByOas oasのx-pages内のcontentsを一覧取得
func listContentsByOas(apiDef *openapi3.T) []*Content {
	contents := []*Content{}
	if apiDef.Info == nil || len(apiDef.Info.Extensions) == 0 {
		return contents
	}

	xPages := &XPages{}
	encodedXPages, err := json.Marshal(apiDef.Info.ExtensionProps.Extensions[constant.OAS_X_PAGES])
	if err != nil {
		log.Errorf("x-pages json.marshal failed. err:%v\n", err)
		return contents
	}
	err = json.Unmarshal(encodedXPages, xPages)
	if err != nil {
		log.Errorf("json.Unmarshal failed. err:%v\n", err)
		return contents
	}

	for _, xPage := range *xPages {
		for _, v := range xPage.Contents {
			contents = append(contents, v)
		}
	}
	return contents
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

// findOperationIDByPathMethod pathとmethodからoperationIDを取得
func findOperationIDByPathMethod(method, path string, apiDef *openapi3.T) string {
	oMap := genOperationIDPathMethodMap(apiDef)
	for operationID, pathMethod := range oMap {
		// rootは除外
		if pathMethod.path == "/" {
			continue
		}

		// /users/{userId} を /users/+ に正規表現パターンにする
		rep := regexp.MustCompile(`{.+}`)
		pattern := rep.ReplaceAllString(pathMethod.path, "+")
		matcher := regexp.MustCompile(pattern)

		// メソッド名が同じ かつ パスと正規表現でマッチする かつ "/"の数が同じ
		if strings.EqualFold(pathMethod.method, method) && matcher.MatchString(path) && (strings.Count(path, "/") == strings.Count(pathMethod.path, "/")) {
			return operationID
		}
	}
	return ""
}

// genPermissions resourceIDをキーにして、operationIDのlistを返す
func genPermissions(apiDef *openapi3.T) []*Permission {
	var permissions []*Permission
	// x-pagesのcontentsをpermissionの基準にする
	contents := listContentsByOas(apiDef)

	// 全てのcontentの関連するresourceIDとoperationIDのセットをapiDefから収集する
	for _, content := range contents {
		// 基準となるoperationIDに関連するoperationIDの配列を取得
		operationIDs := findPermissionOperationIDs(content.OperationID, apiDef)
		// actionsのoperationIDも同じresourceIDとする
		for _, action := range content.Actions {
			operationIDs = append(operationIDs, action.OperationID)
		}

		permissions = append(permissions, &Permission{
			ResourceID:   content.ResourceID,
			OperationIDs: operationIDs,
		})
	}

	return permissions
}

// findPermissionOperationIDs 指定のoperationIDに関連するoperationIDの配列を返す
func findPermissionOperationIDs(operationID string, apiDef *openapi3.T) []string {
	pathMethod := findPathMethodByOperationID(operationID, apiDef)

	var operationIDs []string
	for path, pathItem := range apiDef.Paths {
		// 対象のpathかどうかをチェック
		// ex)
		// 対象のpath "/users
		// 対象のpath "/users/{xxx}"
		// 非対象のpath "/users/purchases/{xxx}"
		// 非対象のpath "/users/{xxx}/purchases/{xxx}"
		if path == pathMethod.path || (strings.Count(path, "/") == 2 && regexp.MustCompile(fmt.Sprintf(`^%s/{.+}$`, pathMethod.path)).MatchString(path)) {
			operations := pathItem.Operations()
			for _, operation := range operations {
				operationIDs = append(operationIDs, operation.OperationID)
			}
		}
	}
	return operationIDs
}

// PermissionsからresourceIDを取得
func findResourceID(operationID string, apiDef *openapi3.T) string {
	permissions := genPermissions(apiDef)

	for _, permission := range permissions {
		operationIDs := helpers.StringSlice(permission.OperationIDs)
		if operationIDs.Contains(operationID) {
			return permission.ResourceID
		}
	}

	return ""
}
