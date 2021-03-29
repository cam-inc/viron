import { stores, domains } from '@viron/lib';
import { ctx } from '../../context';

const getModel = (): stores.definitions.mysql.auditLogs.AuditLogModelCtor =>
  ctx.stores.main.models.auditLogs
    .Model as stores.definitions.mysql.auditLogs.AuditLogModelCtor;

export const findById = async (
  id: string
): Promise<domains.models.auditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as domains.models.auditLog.AuditLog) : null;
};

export const create = async (
  auditLog: domains.models.auditLog.AuditLogCreationAttributes
): Promise<domains.models.auditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as domains.models.auditLog.AuditLog;
};
