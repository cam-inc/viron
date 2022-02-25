import { Connection, Model } from 'mongoose';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as items from './items';
import * as medias from './medias';

export interface MongoModels {
  [users.name]: Model<users.UserDocument>;
  [purchases.name]: Model<purchases.PurchaseDocument>;
  [articles.name]: Model<articles.ArticleDocument>;
  [items.name]: Model<items.ItemDocument>;
  [medias.name]: Model<medias.MediaDocument>;
}

// Get models
export const models = (c: Connection): MongoModels => {
  return {
    [users.name]: c.model(users.name, users.schema),
    [purchases.name]: c.model(purchases.name, purchases.schema),
    [articles.name]: c.model(articles.name, articles.schema),
    [items.name]: c.model(items.name, items.schema),
    [medias.name]: c.model(medias.name, medias.schema),
  };
};
