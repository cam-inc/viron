import { Connection, Document, Model, Schema } from 'mongoose';
import * as auditLogs from './auditlogs';
import * as adminUsers from './adminusers';

export { adminUsers, auditLogs };

interface MongoDefinition<D extends Document> {
  name: string;
  schema: Schema<D, Model<D>>;
  createModel: typeof createModel;
}

export interface MongoDefinitions {
  adminUsers: MongoDefinition<adminUsers.AdminUserDocument>;
  auditLogs: MongoDefinition<auditLogs.AuditLogDocument>;
}

/**
 * Create model class
 */
export const createModel = <D extends Document>(
  c: Connection,
  name: string,
  schema: Schema<D, Model<D>>
): Model<D> => {
  const Model = c.model<D>(name, schema);
  return Model;
};

export type MongoModel = typeof createModel;

/**
 * Models by collection (interface)
 */
export interface MongoModels {
  adminUsers: {
    Model: adminUsers.AdminUserModel;
  };
  auditLogs: {
    Model: auditLogs.AuditLogModel;
  };
}
