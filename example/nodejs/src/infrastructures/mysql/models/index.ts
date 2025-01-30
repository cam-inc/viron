import { Sequelize } from 'sequelize';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as items from './items';
import * as itemDetails from './item_details';
import * as medias from './medias';
import * as vironLibAminUsers from '@viron/lib/dist/infrastructures/mysql/models/adminusers';
import * as vironLibAuitLogs from '@viron/lib/dist/infrastructures/mysql/models/auditlogs';
import * as vironLibRevokedTokens from '@viron/lib/dist/infrastructures/mysql/models/revokedtokens';

export interface MysqlModels {
  [users.name]: users.UserModelStatic;
  [purchases.name]: purchases.PurchaseModelStatic;
  [articles.name]: articles.ArticleModelStatic;
  [items.name]: items.ItemModelStatic;
  [itemDetails.name]: itemDetails.ItemDetailModelStatic;
  [medias.name]: medias.MediaModelStatic;
  [vironLibAminUsers.name]: vironLibAminUsers.AdminUserModelStatic;
  [vironLibAuitLogs.name]: vironLibAuitLogs.AuditLogModelStatic;
  [vironLibRevokedTokens.name]: vironLibRevokedTokens.RevokedTokenModelStatic;
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
    [vironLibAminUsers.name]: vironLibAminUsers.createModel(s),
    [vironLibAuitLogs.name]: vironLibAuitLogs.createModel(s),
    [vironLibRevokedTokens.name]: vironLibRevokedTokens.createModel(s),
  };

  mysqlModels[items.name].belongsTo(mysqlModels[itemDetails.name], {
    foreignKey: 'id',
    targetKey: 'itemId',
    as: 'detail',
  });

  return mysqlModels;
};
