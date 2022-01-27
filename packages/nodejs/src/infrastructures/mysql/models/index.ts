import { Sequelize } from 'sequelize';
import * as auditLogs from './auditlogs';
import * as adminUsers from './adminusers';
import * as revokedTokens from './revokedtokens';

export interface MysqlModels {
  [adminUsers.name]: adminUsers.AdminUserModelStatic;
  [auditLogs.name]: auditLogs.AuditLogModelStatic;
  [revokedTokens.name]: revokedTokens.RevokedTokenModelStatic;
}

export const getModels = (s: Sequelize): MysqlModels => {
  return {
    [adminUsers.name]: adminUsers.createModel(s),
    [auditLogs.name]: auditLogs.createModel(s),
    [revokedTokens.name]: revokedTokens.createModel(s),
  };
};

export const models = { auditLogs, adminUsers, revokedTokens };
