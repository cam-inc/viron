import pino from 'pino';
import { Sequelize } from 'sequelize';
import { container } from '@viron/lib';
import { Mode, MODE_MONGO, MODE_MYSQL } from './constants';
import { preflight as preflightMongo } from './stores/mongo';
import { preflight as preflightMysql } from './stores/mysql';
import {
  Configure,
  get as getConfigure,
  MongoConfigure,
  MysqlConfigure,
} from './configure';
import { Stores } from './stores';
import { noSetEnvMode } from './errors';

///

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

export class Context {
  public mode: Mode;
  public configure: Configure;
  public stores!: Stores;

  constructor() {
    switch (process.env.MODE) {
      case MODE_MONGO:
        this.mode = MODE_MONGO;
        break;
      case MODE_MYSQL:
        this.mode = MODE_MYSQL;
        break;
      default:
        throw noSetEnvMode();
    }

    this.configure = getConfigure(this.mode);
  }

  public async preflight(): Promise<void> {
    await this.preflightStore();
  }

  /**
   * Preflight store
   */
  public async preflightStore(): Promise<void> {
    const mainConfig = this.configure.store.main;

    switch (this.mode) {
      case MODE_MONGO:
        // eslint-disable-next-line no-case-declarations
        const configureMongo = mainConfig as MongoConfigure;
        this.stores = {
          main: await preflightMongo(configureMongo),
        };

        // eslint-disable-next-line no-case-declarations
        //const instanceMongo = this.stores.main.instance as Connection;
        logger.info(
          `Completed loading the store (main). type=${configureMongo.type}, openUri=${configureMongo.openUri}`
        );
        break;
      case MODE_MYSQL:
        // eslint-disable-next-line no-case-declarations
        const configureMysql = mainConfig as MysqlConfigure;
        this.stores = {
          main: await preflightMysql(configureMysql),
        };
        // eslint-disable-next-line no-case-declarations
        const instanceMysql = this.stores.main.instance as Sequelize;
        logger.info(
          'Completed loading the store (main). type=%s "%s://%s:%s/%s". %O',
          configureMysql.type,
          instanceMysql.getDialect(),
          instanceMysql.config.host,
          instanceMysql.config.port,
          instanceMysql.config.database,
          instanceMysql.config
        );
        break;
      default:
        throw noSetEnvMode();
    }

    container.init(this.mode, this.stores.main.instance);
  }
}

export const ctx = new Context();
