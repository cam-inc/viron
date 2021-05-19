import fs from 'fs';
import path from 'path';
import { OpenAPIObject } from 'openapi3-ts';
import jsonSchemaRefParser from '@apidevtools/json-schema-ref-parser';
import { load } from 'js-yaml';
import { createViewer } from './adminrole';

export { OpenAPIObject };

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
  apiDefinition: OpenAPIObject
): Promise<OpenAPIObject> => {
  // viewerが未作成の場合は作成する
  await createViewer(apiDefinition);

  return apiDefinition;
};

// oasファイルのパスを取得
export const getPath = (name: OasNames): string => {
  return path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);
};

// oasをロード
export const loadOas = async (path: string): Promise<OpenAPIObject> => {
  const obj = load(await fs.promises.readFile(path, 'utf8'));
  return obj as OpenAPIObject;
};

// oasをロードして$refを解決する
export const loadResolvedOas = async (path: string): Promise<OpenAPIObject> => {
  const obj = await jsonSchemaRefParser.dereference(path);
  return obj as OpenAPIObject;
};
