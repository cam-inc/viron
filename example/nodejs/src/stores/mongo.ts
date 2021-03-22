import { Connection } from 'mongoose';
import { MongoConfigure } from '../configure';
import { StoreType, modeMongo } from '../constant';
import { createConnection } from './connection/mongo';
import {
  definitions,
  MongoDefinitions,
  MongoModels,
  models,
} from './definitions/mongo';

export interface MongoStore {
  type: StoreType;
  definitions: MongoDefinitions;
  models: MongoModels;
  instance: Connection;
}

export const preflight = async (
  config: MongoConfigure
): Promise<MongoStore> => {
  const c = await createConnection(config.openUri, config.connectOptions);

  return {
    type: modeMongo,
    definitions: definitions,
    models: await models(c),
    instance: c,
  };
};
