import mongoose, { Connection } from 'mongoose';
import { mongo } from '@viron/lib';
import { MongoConfig } from '../../config';
import { MODE, StoreType } from '../../constants';
import { models, MongoModels } from './models';

// mongoose.Connection.openUri openUri
export type openUri = string;

export interface MongoStore {
  type: StoreType;
  models: MongoModels;
  instance: Connection;
}

export const preflight = async (config: MongoConfig): Promise<MongoStore> => {
  mongoose.set('debug', true);
  const c = await mongo.createConnection(config.openUri, config.connectOptions);
  return {
    type: MODE.MONGO,
    models: models(c),
    instance: c,
  };
};
