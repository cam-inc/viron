import pino from 'pino';
import { Sequelize } from 'sequelize';
import { mode, modeMongo, modeMysql } from './constant';
import { preflight as preflightMongo } from './stores/mongo';
import { preflight as preflightMysql } from './stores/mysql';
import {
  Configure,
  get as getConfigure,
  MongoConfigure,
  MysqlConfigure,
} from './configure';
import { Stores } from './stores';
import { newNoSetEnvMode } from './errors';

///

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

export class Context {
  public mode: mode;
  public configure: Configure;
  public stores!: Stores;

  constructor() {
    switch (process.env.MODE) {
      case modeMongo:
        this.mode = modeMongo;
        break;
      case modeMysql:
        this.mode = modeMysql;
        break;
      default:
        throw newNoSetEnvMode();
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
      case modeMongo:
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
      case modeMysql:
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
        throw newNoSetEnvMode();
    }
  }
}

export const ctx = new Context();
