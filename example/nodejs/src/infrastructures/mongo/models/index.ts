import { Connection, Model } from 'mongoose';
import { mongo } from '@viron/lib';
import * as users from './users';
import * as purchases from './purchases';
import * as articles from './articles';
import * as medias from './medias';

const { adminUsers, auditLogs, revokedTokens } = mongo.models;

export interface MongoModels {
  [users.name]: Model<users.UserDocument>;
  [purchases.name]: Model<purchases.PurchaseDocument>;
  [articles.name]: Model<articles.ArticleDocument>;
  [medias.name]: Model<medias.MediaDocument>;
  [adminUsers.name]: Model<mongo.models.adminUsers.AdminUserDocument>;
  [auditLogs.name]: Model<mongo.models.auditLogs.AuditLogDocument>;
  [revokedTokens.name]: Model<mongo.models.revokedTokens.RevokedTokenDocument>;
}

// Get models
export const models = (c: Connection): MongoModels => {
  return {
    [users.name]: c.model(users.name, users.schema),
    [purchases.name]: c.model(purchases.name, purchases.schema),
    [articles.name]: c.model(articles.name, articles.schema),
    [medias.name]: c.model(medias.name, medias.schema),
    [adminUsers.name]: c.model(adminUsers.name, adminUsers.schema),
    [auditLogs.name]: c.model(auditLogs.name, auditLogs.schema),
    [revokedTokens.name]: c.model(revokedTokens.name, revokedTokens.schema),
  };
};
