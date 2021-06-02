import fs from 'fs';
import path from 'path';
import { InfoObject, OpenAPIObject, PathItemObject } from 'openapi3-ts';
import jsonSchemaRefParser from '@apidevtools/json-schema-ref-parser';
import { load } from 'js-yaml';
import { Match, match as matchPath } from 'path-to-regexp';
import { ApiMethod, OAS_X_PAGES } from '../constants';
import { createViewer } from './adminrole';
import { getDebug } from '../logging';

const debug = getDebug('domains:oas');

export interface VironInfoObject extends InfoObject {
  [OAS_X_PAGES]?: OasXPages;
}

export interface VironOpenAPIObject extends OpenAPIObject {
  info: VironInfoObject;
}

export interface OasXPageContent {
  getOperationId: string;
  resourceId: string;
  style: string;
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

export type OasNames =
  | 'adminroles'
  | 'adminusers'
  | 'auditlogs'
  | 'auth'
  | 'authconfigs'
  | 'oas';

// oasを取得
// TODO: 権限見て書き換えたりする
export const get = async (
  apiDefinition: VironOpenAPIObject
): Promise<VironOpenAPIObject> => {
  // viewerが未作成の場合は作成する
  await createViewer(apiDefinition);

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
  const obj = await jsonSchemaRefParser.dereference(path);
  return obj as VironOpenAPIObject;
};

export const uri2ResourceId = (
  uri: string,
  method: ApiMethod,
  apiDefinition: VironOpenAPIObject
): string | null => {
  const toExpressStylePath = (path: string): string =>
    path.replace(/{/g, ':').replace(/}/g, '');

  const match = (uri: string, path: string): Match => {
    const matcher = matchPath(toExpressStylePath(path));
    return matcher(uri);
  };

  const { path, pathItem } = ((
    uri: string
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
  })(uri);
  debug(path, pathItem);
  if (!path || !pathItem) {
    return null;
  }
  const operation = pathItem[method];
  debug(operation);
  if (!operation) {
    return null;
  }

  // uri,methodに対応するopeartionIdを取得
  const findOperationId = (method: ApiMethod): string | null => {
    const operation = pathItem[method];
    return operation?.operationId ?? null;
  };

  // x-pagesからgetOperationIdを取得
  const findResourceId = (operationId: string): string | null => {
    const xPages = apiDefinition.info[OAS_X_PAGES] ?? [];
    const contents = xPages.map((xPage) => xPage.contents).flat();
    const resourceId = contents.find(
      (content) => content.getOperationId === operationId
    )?.resourceId;
    return resourceId ?? null;
  };

  // operationIdからresourceIdを取得できれば終了
  const operationId = findOperationId(method);
  const resourceId = operationId ? findResourceId(operationId) : null;
  debug(operationId, resourceId);
  if (resourceId) {
    return resourceId;
  }

  // /hoges/{hogeId} => /hoges みたいなやつをやる(normalize)
  const x = match(uri, path);
  console.log(x);
  // GET: /hoges の operationId で resourceId を取得できれば終了
  // uri&methodがどこかのactionsに定義されているかもしれないので探す
  //   -> ヒットすればそのresouceIdで確定
  //   -> ヒットしなければGAMEOVER
  return uri;
};
