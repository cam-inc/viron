import { Connection, Model } from 'mongoose';
import { storeDefinitions } from '@viron/lib';
import * as users from './users';
import * as purchases from './purchases';

const { adminUsers, auditLogs, revokedTokens } = storeDefinitions.mongo;

export interface MongoModels {
  [users.name]: Model<users.UserDocument>;
  [purchases.name]: Model<purchases.PurchaseDocument>;
  [adminUsers.name]: Model<storeDefinitions.mongo.adminUsers.AdminUserDocument>;
  [auditLogs.name]: Model<storeDefinitions.mongo.auditLogs.AuditLogDocument>;
  [revokedTokens.name]: Model<storeDefinitions.mongo.revokedTokens.RevokedTokenDocument>;
}

// Get models
export const models = (c: Connection): MongoModels => {
  return {
    [users.name]: c.model(users.name, users.schema),
    [purchases.name]: c.model(purchases.name, purchases.schema),
    [adminUsers.name]: c.model(adminUsers.name, adminUsers.schema),
    [auditLogs.name]: c.model(auditLogs.name, auditLogs.schema),
    [revokedTokens.name]: c.model(revokedTokens.name, revokedTokens.schema),
  };
};
