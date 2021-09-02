import fs from 'fs';
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
  XPageContentType,
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
  defaultRequestBodyValues?: OasCustomRequestBody;
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

export type OasNames =
  | 'adminaccounts'
  | 'adminroles'
  | 'adminusers'
  | 'auditlogs'
  | 'auth'
  | 'authconfigs'
  | 'oas';

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

// uri(ex.`/users/1`) が oasのpath定義(ex.`/users/{userId}`) にヒットするか
const match = (uri: string, path: string): Match =>
  matchPath(toExpressStylePath(path))(uri);

// uriにヒットするpathとpathItemを取得する
export const getPathItem = (
  uri: string,
  oas: VironOpenAPIObject
): {
  path: string | null;
  pathItem: PathItemObject | null;
} => {
  const { paths } = oas;
  const matchedPath = Object.keys(paths).find((p: string) => !!match(uri, p));
  return {
    path: matchedPath ?? null,
    pathItem: matchedPath ? paths[matchedPath] : null,
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

// uri,methodに対応するopeartionを取得
export const findOperation = async (
  uri: string,
  method: string,
  oas: VironOpenAPIObject
): Promise<OperationObject | null> => {
  const dereferencedOas = (await jsonSchemaRefParser.dereference(
    oas
  )) as VironOpenAPIObject;
  const { pathItem } = getPathItem(uri, dereferencedOas);
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
): OperationIdPathMethodMap => {
  const { paths } = oas;
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

// operationIdからpathとmethodを逆引き
const findPathMethodByOperationId = (
  operationId: string,
  oas: VironOpenAPIObject
): PathMethod | null => {
  const map = operationIdPathMethodMap ?? genOperationIdPathMethodMap(oas);
  return map[operationId] ?? null;
};

// uri,methodをactionsに持つcontentのresourceIdを取得
const findResourceIdByActions = (
  uri: string,
  method: ApiMethod,
  oas: VironOpenAPIObject
): string | null => {
  const contents = listContentsByOas(oas);
  const content = contents.find((content) =>
    (content.actions ?? []).find((action) => {
      const pm = findPathMethodByOperationId(action.operationId, oas);
      return pm?.method === method && !!match(uri, pm.path);
    })
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
  const resourceId = operationId ? findResourceId(operationId, oas) : null;
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
  const actionResourceId = findResourceIdByActions(uri, method, oas);
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
