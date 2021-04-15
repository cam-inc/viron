import fs from 'fs';
import path from 'path';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { OpenAPIObject } from 'openapi3-ts';
import { load } from 'js-yaml';

export const loadResolvedOas = async (path: string): Promise<OpenAPIObject> => {
  const obj = await $RefParser.dereference(path);
  return obj as OpenAPIObject;
};

export const loadOas = async (path: string): Promise<OpenAPIObject> => {
  const obj = load(await fs.promises.readFile(path, 'utf8'));
  return obj as OpenAPIObject;
};

export type OasNames = 'auditlogs' | 'authtypes' | 'oas';

export const getOasPath = (name: OasNames): string => {
  return path.resolve(__dirname, '..', 'openapi', `${name}.yaml`);
};
