import { Sequelize, Options } from 'sequelize';
import { MysqlConfig } from '../../config';
import { StoreType, MODE } from '../../constants';
import { logger } from '../../context';
import { models, MysqlModels } from './models';

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
    type: MODE.MYSQL,
    models: ms,
    instance: s,
  };
};

export const createConnection = async (
  options: Options
): Promise<Sequelize> => {
  const s = new Sequelize(options);

  try {
    await s.authenticate();
    logger.info(
      'Connection has been established successfully to the "%s://%s:%s/%s". %O',
      s.getDialect(),
      s.config.host,
      s.config.port,
      s.config.database,
      s.config
    );
    return s;
  } catch (error) {
    logger.error('connection error.');
    throw error;
  }
};
