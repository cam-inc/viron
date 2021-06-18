import { Connection, Model } from 'mongoose';
import { storeDefinitions } from '@viron/lib';
import * as users from './users';

const { adminUsers, auditLogs } = storeDefinitions.mongo;

export interface MongoModels {
  [users.name]: Model<users.UserDocument>;
  [adminUsers.name]: Model<storeDefinitions.mongo.adminUsers.AdminUserDocument>;
  [auditLogs.name]: Model<storeDefinitions.mongo.auditLogs.AuditLogDocument>;
}

// Get models
export const models = (c: Connection): MongoModels => {
  return {
    [users.name]: c.model(users.name, users.schema),
    [adminUsers.name]: c.model(adminUsers.name, adminUsers.schema),
    [auditLogs.name]: c.model(auditLogs.name, auditLogs.schema),
  };
};
