import { Connection, Model } from 'mongoose';
import * as auditLogs from './auditlogs';
import * as adminUsers from './adminusers';
import * as revokedTokens from './revokedtokens';

export interface MongoModels {
  [auditLogs.name]: Model<auditLogs.AuditLogDocument>;
  [adminUsers.name]: Model<adminUsers.AdminUserDocument>;
  [revokedTokens.name]: Model<revokedTokens.RevokedTokenDocument>;
}

export const getModels = (conn: Connection): MongoModels => {
  return {
    [auditLogs.name]: conn.model(auditLogs.name, auditLogs.schema),
    [adminUsers.name]: conn.model(adminUsers.name, adminUsers.schema),
    [revokedTokens.name]: conn.model(revokedTokens.name, revokedTokens.schema),
  };
};

export const models = { auditLogs, adminUsers, revokedTokens };
