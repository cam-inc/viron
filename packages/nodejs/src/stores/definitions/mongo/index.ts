import * as mongoose from 'mongoose';
import * as auditLogs from './auditlogs';

export { auditLogs };

export interface MongoDefinitions {
  auditLogs: {
    name: string;
    schema: mongoose.Schema<
      auditLogs.AuditLogDocument,
      mongoose.Model<auditLogs.AuditLogDocument>
    >;
    createModel: typeof createModel;
  };
}

/**
 * Create model class
 */
export const createModel = <D extends mongoose.Document>(
  c: mongoose.Connection,
  name: string,
  schema: mongoose.Schema<D, mongoose.Model<D>>
): mongoose.Model<D> => {
  const Model = c.model<D>(name, schema);
  return Model;
};

export type MongoModel = typeof createModel;

/**
 * Models by collection (interface)
 */
export interface MongoModels {
  auditLogs: {
    Model: auditLogs.AuditLogModel;
  };
}
