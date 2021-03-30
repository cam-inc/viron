import mongoose from 'mongoose';
import { definitions } from '../../stores';
import { auditLog } from '../../domains';
import { container } from '../';

const getModel = (): definitions.mongo.auditLogs.AuditLogModel => {
  const conn = container.conn as mongoose.Connection;
  return conn.models.auditlogs as definitions.mongo.auditLogs.AuditLogModel;
};

export const findById = async (
  id: string
): Promise<auditLog.AuditLog | null> => {
  const model = getModel();
  const doc = await model.findById(id);
  return doc ? doc.toJSON() : null;
};

export const find = async (): Promise<auditLog.AuditLog[]> => {
  const model = getModel();
  const docs = await model.find();
  return docs.map((doc) => doc.toJSON());
};

export const create = async (
  auditLog: auditLog.AuditLogCreationAttributes
): Promise<auditLog.AuditLog> => {
  const model = getModel();
  const doc = await model.create(auditLog);
  return doc.toJSON();
};
