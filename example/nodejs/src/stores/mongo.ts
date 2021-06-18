import mongoose, { Connection } from 'mongoose';
import { MongoConfig } from '../config';
import { StoreType, MODE_MONGO } from '../constants';
import { createConnection } from './connection/mongo';
import { MongoModels, models } from './definitions/mongo';

export interface MongoStore {
  type: StoreType;
  models: MongoModels;
  instance: Connection;
}

export const preflight = async (config: MongoConfig): Promise<MongoStore> => {
  mongoose.set('debug', true);
  const c = await createConnection(config.openUri, config.connectOptions);

  return {
    type: MODE_MONGO,
    models: models(c),
    instance: c,
  };
};
