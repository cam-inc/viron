package domains

import (
	"encoding/json"
	"strings"

	"github.com/cam-inc/viron/packages/golang/constant"
	"github.com/cam-inc/viron/packages/golang/helpers"
	"github.com/getkin/kin-openapi/jsoninfo"
	"github.com/getkin/kin-openapi/openapi3"
	pathToRegexp "github.com/soongo/path-to-regexp"
)

/*
interface PathMethod {
  path: string;
  method: ApiMethod;
}

type OperationIdPathMethodMap = Record<string, PathMethod>;

// operationIdからpathとmethodを逆引きするためのマップを生成
let operationIdPathMethodMap: OperationIdPathMethodMap | null;


*/

type (
	pathMethod struct {
		path   string
		method string
	}

	operationIDPathMethodMap map[string]*pathMethod

	/*
	   "actions": [
	     {
	       "operationId": "downloadResources",
	       "defaultParametersValue": {
	         "resourceName": "users",
	         "format": "csv"
	       }
	     }

	*/

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

func GetOas(apiDef *openapi3.T, roleIDs []string) *openapi3.T {
	clone := &openapi3.T{}
	if buf, err := json.Marshal(apiDef); err != nil {
		return nil
	} else {
		if err := json.Unmarshal(buf, clone); err != nil {
			return nil
		}
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

			for _, roleID := range roleIDs {
				if hasPermissionByResourceID(roleID, content.ResourceID, method2Permissions(pathMethod.method)) {
					granted = append(granted, content)
				}
			}
		}

		if len(granted) > 0 {
			page.Contents = granted
			rewritedPages = append(rewritedPages, page)
		}
	}
	clone.Extensions[constant.OAS_X_PAGES] = rewritedPages
	return clone
}

/*
// oas取得
export const getOas = async (context: RouteContext): Promise<void> => {
  const oas = await domainsOas.get(
    context.req._context.apiDefinition,
    ctx.config.oas.infoExtentions,
    context.user?.roleIds
  );
  context.res.json(oas);
};


// oasを取得
export const get = async (
  oas: VironOpenAPIObject,
  infoExtentions: VironInfoObjectExtentions = {},
  roleIds: string[] = []
): Promise<VironOpenAPIObject> => {
  // viewerが未作成の場合は作成する
  await createViewer(oas);

  // 参照破壊しないようにDeepCopy
  const clonedApiDefinition = copy(oas);
  Object.assign(clonedApiDefinition.info, infoExtentions);

  // x-pages[].contents[]を書き換える
  const rewriteContent = async (
    content: OasXPageContent
  ): Promise<OasXPageContent | null> => {
    const { resourceId, operationId } = content;
    // 権限のないcontentは削除する(nullを返す)
    const { method } = findPathMethodByOperationId(operationId, oas) ?? {};
    if (!method) {
      // contentに書かれているoperationIdが不正
      debug('operation isn`t exists. operationId: %s', operationId);
      return null;
    }
    const tasks = roleIds.map((roleId) =>
      hasPermissionByResourceId(roleId, resourceId, method2Permissions(method))
    );
    for await (const hasPermission of tasks) {
      if (hasPermission) {
        return content;
      }
    }
    return null;
  };

  // x-pages[]を書き換える
  const rewritePage = async (page: OasXPage): Promise<OasXPage | null> => {
    const contents = await Promise.all(page.contents.map(rewriteContent));
    page.contents = contents.filter(Boolean) as OasXPageContents;
    // contentsが0件になった場合はpageごと消す
    return page.contents.length ? page : null;
  };

  // x-pagesを書き換える
  const pages = await Promise.all(
    (clonedApiDefinition.info[OAS_X_PAGES] ?? []).map(rewritePage)
  );
  clonedApiDefinition.info[OAS_X_PAGES] = pages.filter(Boolean) as OasXPages;

  // validation
  const { isValid, errors } = lint(clonedApiDefinition);
  if (!isValid) {
    debug('OAS validation failure. errors:');
    (errors ?? []).forEach((error, i) => debug('%s: %o', i, error));
    throw oasValidationFailure();
  }
  return clonedApiDefinition;
};
*/

/*
// uriにヒットするとpathとpathItemをoasから取得する
const getPathItem = (
  uri: string,
  apiDefinition: VironOpenAPIObject
): {
  path: string | null;
  pathItem: PathItemObject | null;
} => {
  const { paths } = apiDefinition;
  const matchedPath = Object.keys(paths).find((p: string) => !!match(uri, p));
  return {
    path: matchedPath ?? null,
    pathItem: matchedPath ? paths[matchedPath] : null,
  };
};
*/

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

/*
// uri,methodに対応するopeartionIdを取得
const findOperationId = (
  uri: string,
  method: ApiMethod,
  apiDefinition: VironOpenAPIObject
): string | null => {
  const { pathItem } = getPathItem(uri, apiDefinition);
  const operation = pathItem?.[method];
  return operation?.operationId ?? null;
};

*/

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

/*
// oasのx-pages内のcontentsを一覧取得
const listContentsByOas = (
  apiDefinition: VironOpenAPIObject
): OasXPageContents => {
  const xPages = apiDefinition.info[OAS_X_PAGES] ?? [];
  return xPages.map((xPage) => xPage.contents).flat();
};


*/

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

/*
// x-pagesからoperationIdを取得
const findResourceId = (
  operationId: string,
  apiDefinition: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(apiDefinition);
  const resourceId = contents.find(
    (content) => content.operationId === operationId
  )?.resourceId;
  return resourceId ?? null;
};
*/

func findResourceID(operationID string, apiDef *openapi3.T) string {
	contents := listContentsByOas(apiDef)
	for _, c := range contents {
		if c.OperationID == operationID {
			return c.ResourceID
		}
	}
	return ""
}

/*
const genOperationIdPathMethodMap = (
  apiDefinition: VironOpenAPIObject
): OperationIdPathMethodMap => {
  const { paths } = apiDefinition;
  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach((method) => {
      const operationObject = paths[path][method];
      if (operationObject.operationId) {
        operationIdPathMethodMap = operationIdPathMethodMap ?? {};
        operationIdPathMethodMap[operationObject.operationId] = {
          path: path,
          method: method as ApiMethod,
        };
      }
    });
  });
  return operationIdPathMethodMap as OperationIdPathMethodMap;
};
*/

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

/*
// operationIdからpathとmethodを逆引き
const findPathMethodByOperationId = (
  operationId: string,
  apiDefinition: VironOpenAPIObject
): PathMethod | null => {
  const map =
    operationIdPathMethodMap ?? genOperationIdPathMethodMap(apiDefinition);
  return map[operationId] ?? null;
};
*/

func findPathMethodByOperationID(operationID string, apiDef *openapi3.T) *pathMethod {
	oMap := genOperationIDPathMethodMap(apiDef)
	pm, ok := oMap[operationID]
	if !ok {
		return nil
	}
	return pm
}

/*
// uri,methodをactionsに持つcontentのresourceIdを取得
const findResourceIdByActions = (
  uri: string,
  method: ApiMethod,
  apiDefinition: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(apiDefinition);
  const content = contents.find((content) =>
    (content.actions ?? []).find((action) => {
      const pm = findPathMethodByOperationId(action.operationId, apiDefinition);
      return pm?.method === method && !!match(uri, pm.path);
    })
  );
  return content?.resourceId ?? null;
};
*/

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

/*
// uriとmethodからリソースIDを取得する
export const getResourceId = (
  uri: string,
  method: ApiMethod,
  apiDefinition: VironOpenAPIObject
): string | null => {
  // operationIdからresourceIdを取得できれば終了
  const operationId = findOperationId(uri, method, apiDefinition);
  const resourceId = operationId
    ? findResourceId(operationId, apiDefinition)
    : null;
  if (resourceId) {
    debug(
      'Hit the passed uri and method. %s:%s, ResourceId: %s',
      method,
      uri,
      resourceId
    );
    return resourceId;
  }

  /**
   * リクエストURIが `/foo/{ID}/bar` のとき
   * `/foo/{ID}/bar` > `/foo/{ID}` > `/foo` の順にresourceIdを検索する

  let lastIndex, parentResourceId;
  let parentUri = uri;
  do {
    parentUri = parentUri.slice(0, lastIndex);
    Object.values(API_METHOD).some((method) => {
      const oid = findOperationId(parentUri, method, apiDefinition);
      parentResourceId = oid ? findResourceId(oid, apiDefinition) : null;
      return !!parentResourceId;
    });
    if (parentResourceId) {
      debug(
        'Hit parent uri. %s:%s, ResourceId: %s',
        method,
        uri,
        parentResourceId
      );
      break;
    }
  } while ((lastIndex = parentUri.lastIndexOf('/')) > 0);
  if (parentResourceId) {
    return parentResourceId;
  }

  // uriとmethodがどこかのactionsに定義されているかもしれないので探す
  const actionResourceId = findResourceIdByActions(uri, method, apiDefinition);
  if (actionResourceId) {
    debug(
      'Hit actions uri. %s:%s, ResourceId: %s',
      method,
      uri,
      actionResourceId
    );
    return actionResourceId;
  }

  // ここまでヒットしなければresourceIdを特定できないのでnullを返す
  return null;

*/

/*
import fs from 'fs';
import path from 'path';
import {
  InfoObject,
  OpenAPIObject,
  PathsObject,
  PathItemObject,
} from 'openapi3-ts';
import jsonSchemaRefParser from '@apidevtools/json-schema-ref-parser';
import { load } from 'js-yaml';
import { Match, match as matchPath } from 'path-to-regexp';
import copy from 'fast-copy';
import { lint } from '@viron/linter';
import {
  ApiMethod,
  API_METHOD,
  OAS_X_AUTOCOMPLETE,
  OAS_X_PAGES,
  OAS_X_TABLE,
  OAS_X_TAGS,
  OAS_X_THEME,
  OAS_X_THUMBNAIL,
  Theme,
} from '../constants';
import { getDebug } from '../logging';
import { oasValidationFailure } from '../errors';
import {
  createViewer,
  hasPermissionByResourceId,
  method2Permissions,
} from './adminrole';

const debug = getDebug('domains:oas');

export {
  PathsObject as VironPathsObject,
  PathItemObject as VironPathItemObject,
};

export interface VironInfoObjectExtentions {
  [OAS_X_THUMBNAIL]?: string;
  [OAS_X_THEME]?: Theme;
  [OAS_X_TAGS]?: string[];
  [OAS_X_TABLE]?: OasXTable;
  [OAS_X_PAGES]?: OasXPages;
  [OAS_X_AUTOCOMPLETE]?: OasXAutocomplete;
}

export interface VironInfoObject
  extends InfoObject,
    VironInfoObjectExtentions {}

export interface VironOpenAPIObject extends OpenAPIObject {
  info: VironInfoObject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OasCustomParameters = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OasCustomRequestBody = any;

export interface OasXPageContentAction {
  operationId: string;
  defaultParametersValue?: OasCustomParameters;
  defaultRequestBodyValue?: OasCustomRequestBody;
}

export type OasXPageContentActions = OasXPageContentAction[];

export interface OasXPageContentPreview {
  operationId: string;
  target: string;
  defaultParametersValue?: OasCustomParameters;
  defaultRequestBodyValue?: OasCustomRequestBody;
}

export interface OasXPageContent {
  operationId: string;
  resourceId: string;
  type: string;
  defaultParameterValues?: OasCustomParameters;
  defaultRequestBodyValues?: OasCustomRequestBody;
  pagination?: boolean;
  query?: string[];
  tableLabels?: string[];
  sort?: string[];
  autoRefreshSec?: number;
  actions?: OasXPageContentActions;
  preview?: OasXPageContentPreview;
}

export type OasXPageContents = OasXPageContent[];

export interface OasXPage {
  ID: string;
  group: string;
  title: string;
  description: string;
  contents: OasXPageContents;
}

export type OasXPages = OasXPage[];

export interface OasXTablePager {
  requestPageKey: string;
  requestSizeKey: string;
  responseMaxpageKey: string;
  responsePageKey: string;
}

export interface OasXTableSort {
  requestKey: string;
}

export interface OasXTable {
  responseListKey: string;
  pager: OasXTablePager;
  sort: OasXTableSort;
}

export interface OasXAutocomplete {
  responseLabelKey: string;
  responseValueKey: string;
}

export type OasNames =
  | 'adminroles'
  | 'adminusers'
  | 'auditlogs'
  | 'auth'
  | 'authconfigs'
  | 'oas';

export { lint };

// oasを取得
export const get = async (
  apiDefinition: VironOpenAPIObject,
  infoExtentions: VironInfoObjectExtentions = {},
  roleIds: string[] = []
): Promise<VironOpenAPIObject> => {
  // viewerが未作成の場合は作成する
  await createViewer(apiDefinition);

  // 参照破壊しないようにDeepCopy
  const clonedApiDefinition = copy(apiDefinition);
  Object.assign(clonedApiDefinition.info, infoExtentions);

  // x-pages[].contents[]を書き換える
  const rewriteContent = async (
    content: OasXPageContent
  ): Promise<OasXPageContent | null> => {
    const { resourceId, operationId } = content;
    // 権限のないcontentは削除する(nullを返す)
    const { method } =
      findPathMethodByOperationId(operationId, apiDefinition) ?? {};
    if (!method) {
      // contentに書かれているoperationIdが不正
      debug('operation isn`t exists. operationId: %s', operationId);
      return null;
    }
    const tasks = roleIds.map((roleId) =>
      hasPermissionByResourceId(roleId, resourceId, method2Permissions(method))
    );
    for await (const hasPermission of tasks) {
      if (hasPermission) {
        return content;
      }
    }
    return null;
  };

  // x-pages[]を書き換える
  const rewritePage = async (page: OasXPage): Promise<OasXPage | null> => {
    const contents = await Promise.all(page.contents.map(rewriteContent));
    page.contents = contents.filter(Boolean) as OasXPageContents;
    // contentsが0件になった場合はpageごと消す
    return page.contents.length ? page : null;
  };

  // x-pagesを書き換える
  const pages = await Promise.all(
    (clonedApiDefinition.info[OAS_X_PAGES] ?? []).map(rewritePage)
  );
  clonedApiDefinition.info[OAS_X_PAGES] = pages.filter(Boolean) as OasXPages;

  // validation
  const { isValid, errors } = lint(clonedApiDefinition);
  if (!isValid) {
    debug('OAS validation failure. errors:');
    (errors ?? []).forEach((error, i) => debug('%s: %o', i, error));
    throw oasValidationFailure();
  }
  return clonedApiDefinition;
};

// oasファイルのパスを取得
export const getPath = (name: OasNames): string => {
  return path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);
};

// oasをロード
export const loadOas = async (path: string): Promise<VironOpenAPIObject> => {
  const obj = load(await fs.promises.readFile(path, 'utf8'));
  return obj as VironOpenAPIObject;
};

// oasをロードして$refを解決する
export const loadResolvedOas = async (
  path: string
): Promise<VironOpenAPIObject> => {
  return (await jsonSchemaRefParser.dereference(path, {
    dereference: {
      circular: false, // 循環参照を許容しない
    },
  })) as VironOpenAPIObject;
};

// oasのパス定義をexpree形式に書き換える
const toExpressStylePath = (path: string): string =>
  path.replace(/{/g, ':').replace(/}/g, '');

// uri(ex.`/users/1`) が path(ex.`/users/{userId}`) にヒットするか
const match = (uri: string, path: string): Match =>
  matchPath(toExpressStylePath(path))(uri);









// uri,methodをactionsに持つcontentのresourceIdを取得
const findResourceIdByActions = (
  uri: string,
  method: ApiMethod,
  apiDefinition: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(apiDefinition);
  const content = contents.find((content) =>
    (content.actions ?? []).find((action) => {
      const pm = findPathMethodByOperationId(action.operationId, apiDefinition);
      return pm?.method === method && !!match(uri, pm.path);
    })
  );
  return content?.resourceId ?? null;
};

export const clearCache = (): void => {
  operationIdPathMethodMap = null;
};


*/
