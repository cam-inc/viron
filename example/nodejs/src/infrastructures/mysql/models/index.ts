import { Sequelize } from 'sequelize';
import { mysql } from '@viron/lib';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as medias from './medias';

const { adminUsers, auditLogs, revokedTokens } = mysql.models;

export interface MysqlModels {
  [users.name]: users.UserModelCtor;
  [purchases.name]: purchases.PurchaseModelCtor;
  [articles.name]: articles.ArticleModelCtor;
  [medias.name]: medias.MediaModelCtor;
  [adminUsers.name]: mysql.models.adminUsers.AdminUserModelCtor;
  [auditLogs.name]: mysql.models.auditLogs.AuditLogModelCtor;
  [revokedTokens.name]: mysql.models.revokedTokens.RevokedTokenModelCtor;
}

// Get models
export const models = (s: Sequelize): MysqlModels => {
  return {
    [users.name]: users.createModel(s),
    [purchases.name]: purchases.createModel(s),
    [articles.name]: articles.createModel(s),
    [medias.name]: medias.createModel(s),
    [adminUsers.name]: adminUsers.createModel(s),
    [auditLogs.name]: auditLogs.createModel(s),
    [revokedTokens.name]: revokedTokens.createModel(s),
  };
};
