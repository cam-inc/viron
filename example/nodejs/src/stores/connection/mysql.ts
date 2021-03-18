import { Sequelize, Options } from 'sequelize';
import { logger } from '../../context';

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
