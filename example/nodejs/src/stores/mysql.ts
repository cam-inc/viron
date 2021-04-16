import { MODE_MYSQL, StoreType } from '../constants';
import { MysqlConfigure } from '../configure';
import { createConnection } from './connection/mysql';
import {
  MysqlDefinitions,
  definitions,
  MysqlModels,
  models,
} from './definitions/mysql';
import { Sequelize } from 'sequelize';

export interface MysqlStore {
  type: StoreType;
  definitions: MysqlDefinitions;
  models: MysqlModels;
  instance: Sequelize;
}
export const preflight = async (
  config: MysqlConfigure
): Promise<MysqlStore> => {
  const s = await createConnection(config.connectOptions);

  const ms = await models(s);

  // create tables
  await s.drop({ cascade: true });
  await s.sync({ alter: true });

  return {
    type: MODE_MYSQL,
    definitions: definitions,
    models: ms,
    instance: s,
  };
};
