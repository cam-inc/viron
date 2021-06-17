import { MODE_MYSQL, StoreType } from '../constants';
import { MysqlConfig } from '../config';
import { createConnection } from './connection/mysql';
import { MysqlModels, models } from './definitions/mysql';
import { Sequelize } from 'sequelize';

export interface MysqlStore {
  type: StoreType;
  models: MysqlModels;
  instance: Sequelize;
}
export const preflight = async (config: MysqlConfig): Promise<MysqlStore> => {
  const s = await createConnection(config.connectOptions);

  const ms = models(s);

  // create tables
  await s.drop({ cascade: true });
  await s.sync({ alter: true });

  return {
    type: MODE_MYSQL,
    models: ms,
    instance: s,
  };
};
