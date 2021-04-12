import mongoose from 'mongoose';
import { storeDefinitions } from '../../stores';
import { domainsAuditLog } from '../../domains';
import { container } from '../';

const getModel = (): storeDefinitions.mongo.auditLogs.AuditLogModel => {
  const conn = container.conn as mongoose.Connection;
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

export const createOne = async (
  auditLog: domainsAuditLog.AuditLogCreationAttributes
): Promise<domainsAuditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
