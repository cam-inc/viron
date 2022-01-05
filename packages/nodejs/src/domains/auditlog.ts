import {
  OAS_X_SKIP_AUDITLOG,
  TABLE_SORT_DELIMITER,
  TABLE_SORT_ORDER,
} from '../constants';
import {
  ListWithPager,
  listSchemaPathRegExp,
  replaceSchemaValueByRegExp,
} from '../helpers';
import { FindConditions, repositoryContainer } from '../repositories';
import {
  findOperation,
  VironOpenAPIObject,
  VironRequestBodyObject,
  VironSchemaObject,
} from './oas';

export interface AuditLog {
  id: string;
  requestMethod: string | null;
  requestUri: string | null;
  sourceIp: string | null;
  userId: string | null;
  requestBody: string | null;
  statusCode: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLogCreateAttributes {
  requestMethod: string | null;
  requestUri: string | null;
  sourceIp: string | null;
  userId: string | null;
  requestBody: string | null;
  statusCode: number | null;
}

export type AuditLogUpdateAttributes = AuditLogCreateAttributes;

// 一覧取得
export const list = async (
  conditions?: FindConditions<AuditLog>,
  size?: number,
  page?: number,
  sort = [`createdAt${TABLE_SORT_DELIMITER}${TABLE_SORT_ORDER.DESC}`]
): Promise<ListWithPager<AuditLog>> => {
  const repository = repositoryContainer.getAuditLogRepository();
  return repository.findWithPager(conditions, size, page, sort);
};

// 1件作成
export const createOne = async (
  payload: AuditLogCreateAttributes
): Promise<AuditLog> => {
  const repository = repositoryContainer.getAuditLogRepository();
  return await repository.createOne(payload);
};

// requestBodyをマスク処理して1件作成
export const createOneWithMasking = async (
  uri: string,
  method: string,
  oas: VironOpenAPIObject,
  payload: Omit<AuditLogCreateAttributes, 'requestBody'>,
  requestBody?: Record<string, unknown>
): Promise<AuditLog | null> => {
  const skip = await isSkip(uri, method, oas);
  if (skip) {
    return null;
  }
  const repository = repositoryContainer.getAuditLogRepository();
  return await repository.createOne({
    ...payload,
    requestBody: await maskRequestBody(uri, method, oas, requestBody),
  });
};

// スキップ判定
export const isSkip = async (
  uri: string,
  method: string,
  oas: VironOpenAPIObject
): Promise<boolean> => {
  const operation = await findOperation(uri, method, oas);
  return !!operation?.[OAS_X_SKIP_AUDITLOG];
};

// `format: password` のフィールドをマスクする
export const maskRequestBody = async (
  uri: string,
  method: string,
  oas: VironOpenAPIObject,
  body?: Record<string, unknown>
): Promise<string> => {
  if (!body) {
    return '{}';
  }
  const operation = await findOperation(uri, method, oas);
  if (!operation || !operation.requestBody) {
    return JSON.stringify(body);
  }
  const content = (operation.requestBody as VironRequestBodyObject).content;
  const { schema } = Object.keys(content).map(
    (mediaType) => content[mediaType]
  )[0];
  if (!schema) {
    return JSON.stringify(body);
  }

  // `format: password` のパスの正規表現の一覧
  const regexps = listSchemaPathRegExp(
    schema as VironSchemaObject,
    (v) => v.format === 'password'
  );
  // `*...` で置換
  const maskedBody = replaceSchemaValueByRegExp(
    body,
    regexps,
    (value: string): string => '*'.repeat(value.length)
  );
  return JSON.stringify(maskedBody);
};
