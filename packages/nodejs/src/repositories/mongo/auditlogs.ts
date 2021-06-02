import { Connection } from 'mongoose';
import { storeDefinitions } from '../../stores';
import { domainsAuditLog } from '../../domains';
import { repositoryContainer } from '..';
import { getPagerResults, ListWithPager } from '../../helpers';

const getModel = (): storeDefinitions.mongo.auditLogs.AuditLogModel => {
  const conn = repositoryContainer.conn as Connection;
  return conn.models
    .auditlogs as storeDefinitions.mongo.auditLogs.AuditLogModel;
};

export const findOneById = async (
  id: string
): Promise<domainsAuditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (): Promise<domainsAuditLog.AuditLog[]> => {
  const model = getModel();
  const docs = await model.find();
  return docs.map((doc) => doc.toJSON());
};

export const findWithPager = async (): Promise<
  ListWithPager<domainsAuditLog.AuditLog>
> => {
  const [list, totalCount] = await Promise.all([find(), count()]);
  return {
    ...getPagerResults(totalCount),
    list,
  };
};

export const count = async (/*conditions: FilterQuery<domainsAuditLog.AuditLog> = {}*/): Promise<number> => {
  const model = getModel();
  return await model.countDocuments();
};

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreateAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
