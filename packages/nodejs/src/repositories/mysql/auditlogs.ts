import { Sequelize } from 'sequelize';
import { storeDefinitions } from '../../stores';
import { domainsAuditLog } from '../../domains';
import { repositoryContainer } from '..';
import { getPagerResults, ListWithPager } from '../../helpers';

const getModel = (): storeDefinitions.mysql.auditLogs.AuditLogModelCtor => {
  const conn = repositoryContainer.conn as Sequelize;
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

export const findWithPager = async (): Promise<
  ListWithPager<domainsAuditLog.AuditLog>
> => {
  const model = getModel();
  const result = await model.findAndCountAll();
  return {
    ...getPagerResults(result.count),
    list: result.rows.map((doc) => doc.toJSON() as domainsAuditLog.AuditLog),
  };
};

export const count = async (/*conditions: WhereOptions<User> = {}*/): Promise<number> => {
  const model = getModel();
  return await model.count();
};

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreateAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as domainsAuditLog.AuditLog;
};
