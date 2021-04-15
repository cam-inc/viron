import { repositoryContainer } from '../';

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

export interface AuditLogCreationAttributes {
  requestMethod: string | null;
  requestUri: string | null;
  sourceIp: string | null;
  userId: string | null;
  requestBody: string | null;
  statusCode: number | null;
}

export const list = async (): Promise<AuditLog[]> => {
  const repository = repositoryContainer.getAuditLogRepository();
  return repository.find();
};
