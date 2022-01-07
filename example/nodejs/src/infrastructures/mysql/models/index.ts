import { Sequelize } from 'sequelize';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as medias from './medias';

export interface MysqlModels {
  [users.name]: users.UserModelCtor;
  [purchases.name]: purchases.PurchaseModelCtor;
  [articles.name]: articles.ArticleModelCtor;
  [medias.name]: medias.MediaModelCtor;
}

// Get models
export const models = (s: Sequelize): MysqlModels => {
  return {
    [users.name]: users.createModel(s),
    [purchases.name]: purchases.createModel(s),
    [articles.name]: articles.createModel(s),
    [medias.name]: medias.createModel(s),
  };
};
