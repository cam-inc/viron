import { Sequelize } from 'sequelize';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as items from './items';
import * as itemDetails from './item_details';
import * as medias from './medias';
import { mysql } from '@viron/lib';

export interface MysqlModels {
  [users.name]: users.UserModelStatic;
  [purchases.name]: purchases.PurchaseModelStatic;
  [articles.name]: articles.ArticleModelStatic;
  [items.name]: items.ItemModelStatic;
  [itemDetails.name]: itemDetails.ItemDetailModelStatic;
  [medias.name]: medias.MediaModelStatic;
  [mysql.models.adminUsers
    .name]: mysql.MysqlModels[typeof mysql.models.adminUsers.name];
  [mysql.models.auditLogs
    .name]: mysql.MysqlModels[typeof mysql.models.auditLogs.name];
  [mysql.models.revokedTokens
    .name]: mysql.MysqlModels[typeof mysql.models.revokedTokens.name];
  [mysql.models.adminUserSsoTokens
    .name]: mysql.MysqlModels[typeof mysql.models.adminUserSsoTokens.name];
}

// Get models
export const models = (s: Sequelize): MysqlModels => {
  const mysqlModels = {
    [users.name]: users.createModel(s),
    [purchases.name]: purchases.createModel(s),
    [articles.name]: articles.createModel(s),
    [items.name]: items.createModel(s),
    [itemDetails.name]: itemDetails.createModel(s),
    [medias.name]: medias.createModel(s),
    [mysql.models.adminUsers.name]: mysql.models.adminUsers.createModel(s),
    [mysql.models.adminUserSsoTokens.name]:
      mysql.models.adminUserSsoTokens.createModel(s),
    [mysql.models.auditLogs.name]: mysql.models.auditLogs.createModel(s),
    [mysql.models.revokedTokens.name]:
      mysql.models.revokedTokens.createModel(s),
  };

  mysqlModels[items.name].belongsTo(mysqlModels[itemDetails.name], {
    foreignKey: 'id',
    targetKey: 'itemId',
    as: 'detail',
  });

  return mysqlModels;
};
