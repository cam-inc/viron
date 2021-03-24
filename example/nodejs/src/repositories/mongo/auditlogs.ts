import { stores, domains } from '@viron/nodejs';
import { ctx } from '../../context';

const getModel = (): stores.definitions.mongo.auditLogs.AuditLogModel =>
  ctx.stores.main.models.auditLogs
    .Model as stores.definitions.mongo.auditLogs.AuditLogModel;

export const findById = async (
  id: string
): Promise<domains.auditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const create = async (
  auditLog: domains.auditLog.AuditLogCreationAttributes
): Promise<domains.auditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
