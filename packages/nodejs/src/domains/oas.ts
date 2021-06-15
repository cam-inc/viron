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
import { lint } from '@viron/linter';
import {
  ApiMethod,
  API_METHOD,
  OAS_X_PAGES,
  OAS_X_TABLE,
  OAS_X_TAGS,
  OAS_X_THEME,
  OAS_X_THUMBNAIL,
  Theme,
} from '../constants';
import { getDebug } from '../logging';
import { oasValidationFailure } from '../errors';
import { createViewer } from './adminrole';

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
  infoExtentions?: VironInfoObjectExtentions
): Promise<VironOpenAPIObject> => {
  // viewerが未作成の場合は作成する
  await createViewer(apiDefinition);

  if (infoExtentions) {
    Object.assign(apiDefinition.info, infoExtentions);
  }

  // TODO: 権限見て書き換えたりする

  // validation
  const { isValid, errors } = lint(apiDefinition);
  if (!isValid) {
    debug('OAS validation failure. errors:');
    (errors ?? []).forEach((error, i) => debug('%s: %o', i, error));
    throw oasValidationFailure();
  }
  return apiDefinition;
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

// oasのx-pages内のcontentsを一覧取得
const listContentsByOas = (
  apiDefinition: VironOpenAPIObject
): OasXPageContents => {
  const xPages = apiDefinition.info[OAS_X_PAGES] ?? [];
  return xPages.map((xPage) => xPage.contents).flat();
};

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

interface PathMethod {
  path: string;
  method: ApiMethod;
}

type OperationIdPathMethodMap = Record<string, PathMethod>;

// operationIdからpathとmethodを逆引きするためのマップを生成
let operationIdPathMethodMap: OperationIdPathMethodMap;
const genOperationIdPathMethodMap = (
  apiDefinition: VironOpenAPIObject
): OperationIdPathMethodMap => {
  const { paths } = apiDefinition;
  operationIdPathMethodMap = {};
  Object.keys(paths).forEach((path) => {
    Object.keys(paths[path]).forEach((method) => {
      const operationObject = paths[path][method];
      if (operationObject.operationId) {
        operationIdPathMethodMap[operationObject.operationId] = {
          path: path,
          method: method as ApiMethod,
        };
      }
    });
  });
  return operationIdPathMethodMap;
};

// operationIdからpathとmethodを逆引き
const findPathMethodByOperationId = (
  operationId: string,
  apiDefinition: VironOpenAPIObject
): PathMethod => {
  const map =
    operationIdPathMethodMap ?? genOperationIdPathMethodMap(apiDefinition);
  return map[operationId];
};

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
      return pm.method === method && !!match(uri, pm.path);
    })
  );
  return content?.resourceId ?? null;
};

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
   * リクエストURIが `/foo/{id}/bar` のとき
   * `/foo/{id}/bar` > `/foo/{id}` > `/foo` の順にresourceIdを検索する
   */
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
};
