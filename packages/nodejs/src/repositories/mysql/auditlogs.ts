import { FindOptions, Sequelize, WhereOptions } from 'sequelize';
import { AuditLogModelCtor } from '../../infrastructures/mysql/models/auditlogs';
import { domainsAuditLog } from '../../domains';
import { repositoryContainer } from '..';
import {
  getMysqlFindOptions,
  getMysqlSortOptions,
  getPagerResults,
  ListWithPager,
  normalizeMysqlFilterQuery,
} from '../../helpers';

const getModel = (): AuditLogModelCtor => {
  const conn = repositoryContainer.conn as Sequelize;
  return conn.models.auditlogs as AuditLogModelCtor;
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
  sort: string[] | null = null,
  options: FindOptions<domainsAuditLog.AuditLog> = {}
): Promise<domainsAuditLog.AuditLog[]> => {
  const model = getModel();
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
  const docs = await model.findAll(options);
  return docs.map((doc) => doc.toJSON() as domainsAuditLog.AuditLog);
};

export const findWithPager = async (
  conditions: WhereOptions<domainsAuditLog.AuditLog> = {},
  size?: number,
  page?: number,
  sort: string[] | null = null
): Promise<ListWithPager<domainsAuditLog.AuditLog>> => {
  const model = getModel();
  const options = getMysqlFindOptions(size, page);
  options.where = normalizeMysqlFilterQuery(conditions);
  options.order = getMysqlSortOptions(sort);
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
  return await model.count({ where: normalizeMysqlFilterQuery(conditions) });
};

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreateAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON() as domainsAuditLog.AuditLog;
};
