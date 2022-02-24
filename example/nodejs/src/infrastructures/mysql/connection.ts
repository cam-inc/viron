import { mysql } from '@viron/lib';
import { Sequelize } from 'sequelize';
import { MysqlConfig } from '../../config';
import { StoreType, MODE } from '../../constants';
import { models, MysqlModels } from './models';

export interface MysqlStore {
  type: StoreType;
  models: MysqlModels;
  instance: Sequelize;
}

export const init = async (config: MysqlConfig): Promise<MysqlStore> => {
  const s = await mysql.createConnection(config.connectOptions);

  const ms = models(s);

  // create tables
  await s.drop({ cascade: true });
  await s.sync({ alter: true });

  return {
    type: MODE.MYSQL,
    models: ms,
    instance: s,
  };
};
