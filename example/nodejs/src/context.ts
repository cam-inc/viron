import pino from 'pino';
import { Sequelize } from 'sequelize';
import { repositoryContainer, domainsAuth } from '@viron/lib';
import { Mode, MODE_MONGO, MODE_MYSQL } from './constants';
import { preflight as preflightMongo } from './stores/mongo';
import { preflight as preflightMysql } from './stores/mysql';
import { Config, get as getConfig, MongoConfig, MysqlConfig } from './config';
import { Stores } from './stores';
import { noSetEnvMode } from './errors';
import { load as loadSampleData } from './sampledata';

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

export class Context {
  public mode: Mode;
  public config: Config;
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

    this.config = getConfig(this.mode);
  }

  public async preflight(): Promise<void> {
    await this.preflightStore();
    await loadSampleData();
    domainsAuth.initJwt(this.config.auth.jwt);
  }

  /**
   * Preflight store
   */
  public async preflightStore(): Promise<void> {
    const mainConfig = this.config.store.main;

    switch (this.mode) {
      case MODE_MONGO:
        // eslint-disable-next-line no-case-declarations
        const configMongo = mainConfig as MongoConfig;
        this.stores = {
          main: await preflightMongo(configMongo),
        };

        // eslint-disable-next-line no-case-declarations
        //const instanceMongo = this.stores.main.instance as Connection;
        logger.info(
          `Completed loading the store (main). type=${configMongo.type}, openUri=${configMongo.openUri}`
        );
        break;
      case MODE_MYSQL:
        // eslint-disable-next-line no-case-declarations
        const configMysql = mainConfig as MysqlConfig;
        this.stores = {
          main: await preflightMysql(configMysql),
        };
        // eslint-disable-next-line no-case-declarations
        const instanceMysql = this.stores.main.instance as Sequelize;
        logger.info(
          'Completed loading the store (main). type=%s "%s://%s:%s/%s". %O',
          configMysql.type,
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

    repositoryContainer.init(this.mode, this.stores.main.instance);
  }
}

export const ctx = new Context();
