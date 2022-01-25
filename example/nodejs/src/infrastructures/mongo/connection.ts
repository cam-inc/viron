import { mongo } from '@viron/lib';
import { MongoConfig } from '../../config';
import { MODE, StoreType } from '../../constants';
import { models, MongoModels } from './models';

// mongoose.Connection.openUri openUri
export type openUri = string;

export interface MongoStore {
  type: StoreType;
  models: MongoModels;
  instance: mongo.mongoose.Connection;
}

export const preflight = async (config: MongoConfig): Promise<MongoStore> => {
  mongo.mongoose.set('debug', true);
  const c = await mongo.createConnection(config.openUri, config.connectOptions);
  return {
    type: MODE.MONGO,
    models: models(c),
    instance: c,
  };
};
