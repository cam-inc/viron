import { Sequelize, Options } from 'sequelize';
import { getDebug } from '../../logging';
const debug = getDebug('infrastructures:mysql:connection');

export const createConnection = async (
  options: Options
): Promise<Sequelize> => {
  const s = new Sequelize(options);

  try {
    await s.authenticate();
    debug(
      'Connection has been established successfully to the "%s://%s:%s/%s". %O',
      s.getDialect(),
      s.config.host,
      s.config.port,
      s.config.database,
      s.config
    );
    return s;
  } catch (error) {
    debug('connection error.');
    throw error;
  }
};
