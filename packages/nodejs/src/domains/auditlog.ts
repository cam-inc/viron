import { ListWithPager } from '../helpers';
import { repositoryContainer } from '../repositories';

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
export const list = async (): Promise<ListWithPager<AuditLog>> => {
  const repository = repositoryContainer.getAuditLogRepository();
  return repository.findWithPager();
};
