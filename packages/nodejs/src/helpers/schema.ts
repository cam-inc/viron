/* eslint-disable @typescript-eslint/no-explicit-any */
import copy from 'fast-copy';
import jsonPointer from 'json-pointer';
import traverse from 'json-schema-traverse';
import { VironSchemaObject } from '../domains/oas';

// schemaPathをデータアクセス用の正規表現に変換
const schemaPathToRegExp = (
  jsonSchema: VironSchemaObject,
  schemaPath: string
): RegExp => {
  const fields = schemaPath.split('/');
  let regExpStr = '';
  for (const field of fields) {
    if (field === 'properties') {
      if (jsonSchema.type === 'object' && jsonSchema.properties) {
        jsonSchema = jsonSchema.properties;
        continue;
      }
    }
    if (field === 'items') {
      if (jsonSchema.type === 'array' && jsonSchema.items) {
        jsonSchema = jsonSchema.items;
        regExpStr += '/\\d{1,}';
        continue;
      }
    }
    // eslint-disable-next-line no-prototype-builtins
    if (jsonSchema.hasOwnProperty(field)) {
      jsonSchema = jsonSchema[field];
      regExpStr += '/' + field;
    }
  }
  return new RegExp(`^${regExpStr}$`);
};

const defaultFilter = (): boolean => true;

export type SchemaFilter = (value: any, schemaPath: string) => boolean;

// json-schemaに対してfilterにmatchするschemaPathの正規表現取得
export const listSchemaPathRegExp = (
  jsonSchema: VironSchemaObject,
  filter: SchemaFilter = defaultFilter
): RegExp[] => {
  const list: RegExp[] = [];
  traverse(jsonSchema, (value: any, schemaPath: string): void => {
    schemaPath &&
      filter(value, schemaPath) &&
      list.push(schemaPathToRegExp(jsonSchema, schemaPath));
  });
  return list;
};

export type SchemaReplacer = (value: any) => any;

// value内の正規表現に一致する値に対しreplacerを実行する
export const replaceSchemaValueByRegExp = (
  value: Record<string, any>,
  regexps: RegExp | RegExp[],
  replacer: SchemaReplacer
): Record<string, any> => {
  const matchers = Array.isArray(regexps) ? regexps : [regexps];
  const newValue = copy(value);
  jsonPointer.walk(newValue, (v: any, p: string): void => {
    if (matchers.some((reg) => reg.test(p))) {
      jsonPointer.set(newValue, p, replacer(v));
    }
  });
  return newValue;
};
