import { Sequelize } from 'sequelize';
import { storeDefinitions } from '@viron/lib';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';

const { adminUsers, auditLogs, revokedTokens } = storeDefinitions.mysql;

export interface MysqlModels {
  [users.name]: users.UserModelCtor;
  [purchases.name]: purchases.PurchaseModelCtor;
  [articles.name]: articles.ArticleModelCtor;
  [adminUsers.name]: storeDefinitions.mysql.adminUsers.AdminUserModelCtor;
  [auditLogs.name]: storeDefinitions.mysql.auditLogs.AuditLogModelCtor;
  [revokedTokens.name]: storeDefinitions.mysql.revokedTokens.RevokedTokenModelCtor;
}

// Get models
export const models = (s: Sequelize): MysqlModels => {
  return {
    [users.name]: users.createModel(s),
    [purchases.name]: purchases.createModel(s),
    [articles.name]: articles.createModel(s),
    [adminUsers.name]: adminUsers.createModel(s),
    [auditLogs.name]: auditLogs.createModel(s),
    [revokedTokens.name]: revokedTokens.createModel(s),
  };
};
