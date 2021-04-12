import { Sequelize } from 'sequelize';
import { storeDefinitions } from '../../stores';
import { domainsAuditLog } from '../../domains';
import { container } from '../';

const getModel = (): storeDefinitions.mysql.auditLogs.AuditLogModelCtor => {
  const conn = container.conn as Sequelize;
  return conn.models
    .auditlogs as storeDefinitions.mysql.auditLogs.AuditLogModelCtor;
};

export const findOneById = async (
  id: string
): Promise<domainsAuditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findByPk(id);
  return doc ? (doc.toJSON() as domainsAuditLog.AuditLog) : null;
};

export const find = async (): Promise<domainsAuditLog.AuditLog[]> => {
  const model = getModel();
  const docs = await model.findAll();
  return docs.map((doc) => doc.toJSON() as domainsAuditLog.AuditLog);
};

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreationAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as domainsAuditLog.AuditLog;
};
