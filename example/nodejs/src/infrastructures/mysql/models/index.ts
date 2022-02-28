import { Sequelize } from 'sequelize';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as items from './items';
import * as itemDetails from './item_details';
import * as medias from './medias';

export interface MysqlModels {
  [users.name]: users.UserModelStatic;
  [purchases.name]: purchases.PurchaseModelStatic;
  [articles.name]: articles.ArticleModelStatic;
  [items.name]: items.ItemModelStatic;
  [itemDetails.name]: itemDetails.ItemDetailModelStatic;
  [medias.name]: medias.MediaModelStatic;
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
  };

  mysqlModels[items.name].belongsTo(mysqlModels[itemDetails.name], {
    foreignKey: 'id',
    targetKey: 'itemId',
    as: 'detail',
  });

  return mysqlModels;
};
