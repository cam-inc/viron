import { Sequelize } from 'sequelize';
import { FindOptions, WhereOptions } from 'sequelize/types';
import { storeDefinitions } from '../../stores';
import { domainsAuditLog } from '../../domains';
import { repositoryContainer } from '..';
import {
  getMysqlFindOptions,
  getPagerResults,
  ListWithPager,
} from '../../helpers';

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

export const find = async (
  conditions: WhereOptions<domainsAuditLog.AuditLog> = {},
  options: FindOptions<domainsAuditLog.AuditLog> = {}
): Promise<domainsAuditLog.AuditLog[]> => {
  const model = getModel();
  options.where = conditions;
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as domainsAuditLog.AuditLog);
};

export const findWithPager = async (
  conditions: WhereOptions<domainsAuditLog.AuditLog> = {},
  size?: number,
  page?: number
): Promise<ListWithPager<domainsAuditLog.AuditLog>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = conditions;
  const result = await model.findAndCountAll(options);
  return {
    ...getPagerResults(result.count, size, page),
    list: result.rows.map((doc) => doc.toJSON() as domainsAuditLog.AuditLog),
  };
};

export const count = async (
  conditions: WhereOptions<domainsAuditLog.AuditLog> = {}
): Promise<number> => {
  const model = getModel();
  return await model.count({ where: conditions });
};

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreateAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as domainsAuditLog.AuditLog;
};
