import fs from 'fs';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import { OpenAPIObject } from 'openapi3-ts';
import { load } from 'js-yaml';

export const loadResolvedOpenapi = async (
  path: string
): Promise<OpenAPIObject> => {
  const obj = await $RefParser.dereference(path);
  return obj as OpenAPIObject;
};

export const loadOpenapi = async (path: string): Promise<OpenAPIObject> => {
  const obj = load(await fs.promises.readFile(path, 'utf8'));
  return obj as OpenAPIObject;
};
