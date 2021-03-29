import { stores, domains } from '@viron/lib';
import { ctx } from '../../context';

const getModel = (): stores.definitions.mongo.auditLogs.AuditLogModel =>
  ctx.stores.main.models.auditLogs
    .Model as stores.definitions.mongo.auditLogs.AuditLogModel;

export const findById = async (
  id: string
): Promise<domains.models.auditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const create = async (
  auditLog: domains.models.auditLog.AuditLogCreationAttributes
): Promise<domains.models.auditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
