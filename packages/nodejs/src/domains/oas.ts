import path from 'path';
import {
  InfoObject,
  OpenAPIObject,
  OperationObject,
  PathsObject,
  PathItemObject,
  RequestBodyObject,
  SchemaObject,
} from 'openapi3-ts';
import jsonSchemaRefParser from '@apidevtools/json-schema-ref-parser';
import { match as matchPath } from 'path-to-regexp';
import copy from 'fast-copy';
import deepmerge from 'deepmerge';
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
  VironDomains,
  VIRON_DOMAINS,
  XPageContentType,
} from '../constants';
import { getDebug } from '../logging';
import { oasValidationFailure } from '../errors';
import {
  createViewer,
  hasPermission,
  hasPermissionByResourceId,
  isApiMethod,
  method2Permissions,
} from './adminrole';

const debug = getDebug('domains:oas');

export {
  PathsObject as VironPathsObject,
  PathItemObject as VironPathItemObject,
  RequestBodyObject as VironRequestBodyObject,
  SchemaObject as VironSchemaObject,
};

export interface VironOperationObject extends OperationObject {
  operationId: string;
}

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

export interface OasXPageContent {
  title: string;
  type: XPageContentType;
  operationId: string;
  defaultParametersValue?: OasCustomParameters;
  defaultRequestBodyValue?: OasCustomRequestBody;
  pagination?: boolean;
  autoRefreshSec?: number;
  actions?: OasXPageContentActions;
  // only used by backend
  resourceId: string;
}

export type OasXPageContents = OasXPageContent[];

export interface OasXPage {
  id: string;
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

export { lint };

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

  // 権限のないOperationをフィルタする
  const filterOperation = async (
    path: string,
    method: ApiMethod
  ): Promise<OperationObject | null> => {
    const pathItem: PathItemObject = clonedApiDefinition.paths[path];
    const operation = pathItem[method];
    if (!operation?.operationId) {
      return operation ?? null;
    }
    const tasks = roleIds.map((roleId) =>
      hasPermission(roleId, path, method, oas)
    );
    for await (const hasPermission of tasks) {
      if (hasPermission) {
        return operation;
      }
    }
    return null;
  };

  // pathItemを書き換える
  const rewritePathItem = async (path: string): Promise<PathsObject | null> => {
    const pathItem: PathItemObject = clonedApiDefinition.paths[path];
    const newPathItems = await Promise.all(
      Object.keys(pathItem).map(async (method: string) => {
        if (!isApiMethod(method)) {
          return null;
        }
        const operation = await filterOperation(path, method);
        if (operation) {
          return { [method]: operation };
        }
        return null;
      })
    );
    const newPathItem = Object.assign({}, ...newPathItems);
    if (Object.keys(newPathItem).length <= 0) {
      return null;
    }
    return { [path]: newPathItem };
  };

  // x-pagesを書き換える
  const pages = await Promise.all(
    (clonedApiDefinition.info[OAS_X_PAGES] ?? []).map(rewritePage)
  );
  clonedApiDefinition.info[OAS_X_PAGES] = pages.filter(Boolean) as OasXPages;

  // pathsを書き換える
  const paths = await Promise.all(
    Object.keys(clonedApiDefinition.paths).map(rewritePathItem)
  );
  clonedApiDefinition.paths = Object.assign({}, ...paths);

  // validation
  const { isValid, errors } = lint(clonedApiDefinition);
  if (!isValid) {
    debug('OAS validation failure. errors:');
    (errors ?? []).forEach((error, i) => debug('%s: %o', i, error));
    debug('oas: %s', JSON.stringify(clonedApiDefinition));
    throw oasValidationFailure();
  }
  return clonedApiDefinition;
};

// oasファイルのパスを取得
export const getPath = (name: VironDomains): string => {
  return path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);
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

// uriにヒットするpathとpathItemを取得する
export const getPathItem = (
  uri: string,
  oas: VironOpenAPIObject
): {
  path: string | null;
  pathItem: PathItemObject | null;
  params: Record<string, string> | null;
} => {
  const { paths } = oas;
  let matchObj: { params: Record<string, string> } | undefined;
  const matchedPath = Object.keys(paths).find((p: string) => {
    const matcher =
      typeof paths[p]['x-viron-path-matcher'] === 'function'
        ? paths[p]['x-viron-path-matcher']
        : matchPath(toExpressStylePath(p));
    paths[p]['x-viron-path-matcher'] = matcher; // cache
    const m = matcher(uri);
    if (m) {
      matchObj = m;
    }
    return !!m;
  });
  return {
    path: matchedPath ?? null,
    pathItem: matchedPath ? paths[matchedPath] : null,
    params: matchObj ? matchObj.params : null,
  };
};

// oasのx-pages内のcontentsを一覧取得
const listContentsByOas = (oas: VironOpenAPIObject): OasXPageContents => {
  const xPages = oas.info[OAS_X_PAGES] ?? [];
  return xPages.map((xPage) => xPage.contents).flat();
};

// x-pagesからoperationIdに一致するresourceIdを取得
const findResourceId = (
  operationId: string,
  oas: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(oas);
  const resourceId = contents.find(
    (content) => content.operationId === operationId
  )?.resourceId;
  return resourceId ?? null;
};

// oasの$refを解決する
export const dereference = async (
  oas: VironOpenAPIObject
): Promise<VironOpenAPIObject> => {
  return (await jsonSchemaRefParser.dereference(oas)) as VironOpenAPIObject;
};

// uri,methodに対応するopeartionを取得
export const findOperation = (
  uri: string,
  method: string,
  oas: VironOpenAPIObject
): VironOperationObject | null => {
  const { pathItem } = getPathItem(uri, oas);
  return pathItem?.[method.toLocaleLowerCase()] ?? null;
};

// uri,methodに対応するopeartionIdを取得
const findOperationId = (
  uri: string,
  method: ApiMethod,
  oas: VironOpenAPIObject
): string | null => {
  const { pathItem } = getPathItem(uri, oas);
  const operation = pathItem?.[method.toLocaleLowerCase()] ?? null;
  return operation?.operationId ?? null;
};

interface PathMethod {
  path: string;
  method: ApiMethod;
}

type OperationIdPathMethodMap = Record<string, PathMethod>;

// operationIdからpathとmethodを逆引きするためのマップを生成
let operationIdPathMethodMap: OperationIdPathMethodMap | null;
const genOperationIdPathMethodMap = (
  oas: VironOpenAPIObject
): OperationIdPathMethodMap | null => {
  const { paths } = oas;
  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach((method: string) => {
      if (!isApiMethod(method)) {
        return;
      }
      const operationObject = paths[path][method];
      if (operationObject.operationId) {
        operationIdPathMethodMap = operationIdPathMethodMap ?? {};
        operationIdPathMethodMap[operationObject.operationId] = {
          path,
          method,
        };
      }
    });
  });
  return operationIdPathMethodMap;
};

// operationIdからpathとmethodを逆引き
const findPathMethodByOperationId = (
  operationId: string,
  oas: VironOpenAPIObject
): PathMethod | null => {
  const map = operationIdPathMethodMap ?? genOperationIdPathMethodMap(oas);
  return map?.[operationId] ?? null;
};

// operationIdをactionsに持つcontentのresourceIdを取得
const findResourceIdByActions = (
  operationId: string,
  oas: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(oas);
  const content = contents.find((content) =>
    (content.actions ?? []).find((action) => action.operationId === operationId)
  );
  return content?.resourceId ?? null;
};

export const clearCache = (): void => {
  operationIdPathMethodMap = null;
};

// uriとmethodからリソースIDを取得する
export const getResourceId = (
  uri: string,
  method: ApiMethod,
  oas: VironOpenAPIObject
): string | null => {
  // operationIdからresourceIdを取得できれば終了
  const operationId = findOperationId(uri, method, oas);
  if (!operationId) {
    return null;
  }

  const resourceId = findResourceId(operationId, oas);
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
   * リクエストURIが `/foo/{id}/bar` のとき
   * `/foo/{id}/bar` > `/foo/{id}` > `/foo` の順にresourceIdを検索する
   */
  let lastIndex, parentResourceId;
  let parentUri = uri;
  do {
    parentUri = parentUri.slice(0, lastIndex);
    Object.values(API_METHOD).some((method) => {
      const oid = findOperationId(parentUri, method, oas);
      parentResourceId = oid ? findResourceId(oid, oas) : null;
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
  const actionResourceId = findResourceIdByActions(operationId, oas);
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
};

// 複数のoasをマージする
export const merge = (
  ...apiDefinitions: VironOpenAPIObject[]
): VironOpenAPIObject => {
  return deepmerge.all(apiDefinitions) as VironOpenAPIObject;
};

// @viron/libが提供している機能のoasを1つにして返す
export const getVironSpec = async (): Promise<VironOpenAPIObject> => {
  const names = Object.values(VIRON_DOMAINS);
  const specs = await Promise.all(
    names.map((name) => loadResolvedOas(getPath(name)))
  );
  return merge(...specs);
};
