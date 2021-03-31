import { Sequelize } from 'sequelize';
import { definitions } from '../../stores';
import { auditLog } from '../../domains';
import { container } from '../';

const getModel = (): definitions.mysql.auditLogs.AuditLogModelCtor => {
  const conn = container.conn as Sequelize;
  return conn.models.auditlogs as definitions.mysql.auditLogs.AuditLogModelCtor;
};

export const findById = async (
  id: string
): Promise<auditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as auditLog.AuditLog) : null;
};

export const find = async (): Promise<auditLog.AuditLog[]> => {
  const model = getModel();
  const docs = await model.findAll();
  return docs.map((doc) => doc.toJSON() as auditLog.AuditLog);
};

export const create = async (
  auditLog: auditLog.AuditLogCreationAttributes
): Promise<auditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as auditLog.AuditLog;
};
