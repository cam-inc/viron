import { Sequelize } from 'sequelize';
import { storeDefinitions } from '@viron/lib';
import * as users from './users';

const { adminUsers, auditLogs } = storeDefinitions.mysql;

export interface MysqlModels {
  [users.name]: users.UserModelCtor;
  [adminUsers.name]: storeDefinitions.mysql.adminUsers.AdminUserModelCtor;
  [auditLogs.name]: storeDefinitions.mysql.auditLogs.AuditLogModelCtor;
}

// Get models
export const models = (s: Sequelize): MysqlModels => {
  return {
    [users.name]: users.createModel(s),
    [adminUsers.name]: adminUsers.createModel(s),
    [auditLogs.name]: auditLogs.createModel(s),
  };
};
