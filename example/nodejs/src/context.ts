import pino from 'pino';
import { Sequelize } from 'sequelize';
import { repositoryContainer, domainsAuth } from '@viron/lib';
import { Mode, MODE, ServiceEnv, SERVICE_ENV } from './constants';
import {
  MongoStore,
  preflight as preflightMongo,
} from './infrastructures/mongo/connection';
import {
  MysqlStore,
  preflight as preflightMysql,
} from './infrastructures/mysql/connection';
import { Config, get as getConfig, MongoConfig, MysqlConfig } from './config';
import { noSetEnvMode } from './errors';
import { load as loadSampleData } from './sampledata';

export const logger = pino({
  name: 'example',
  level: 'debug',
  timestamp: true,
});

export interface Stores {
  main: MongoStore | MysqlStore;
}

export class Context {
  public mode: Mode;
  public serviceEnv: ServiceEnv;
  public config: Config;
  public stores!: Stores;

  constructor() {
    switch (process.env.MODE) {
      case MODE.MONGO:
        this.mode = MODE.MONGO;
        break;
      case MODE.MYSQL:
        this.mode = MODE.MYSQL;
        break;
      default:
        throw noSetEnvMode();
    }

    switch (process.env.SERVICE_ENV) {
      case SERVICE_ENV.DEVELOPMENT:
        this.serviceEnv = SERVICE_ENV.DEVELOPMENT;
        break;
      case SERVICE_ENV.PRODUCTION:
        this.serviceEnv = SERVICE_ENV.PRODUCTION;
        break;
      default:
        this.serviceEnv = SERVICE_ENV.LOCAL;
        break;
    }

    this.config = getConfig(this.mode, this.serviceEnv);
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
      case MODE.MONGO: {
        // eslint-disable-next-line no-case-declarations
        const configMongo = mainConfig as MongoConfig;
        this.stores = {
          main: await preflightMongo(configMongo),
        };
        logger.info(
          `Completed loading the store (main). type=${configMongo.type}, openUri=${configMongo.openUri}`
        );
        break;
      }
      case MODE.MYSQL: {
        // eslint-disable-next-line no-case-declarations
        const configMysql = mainConfig as MysqlConfig;
        this.stores = {
          main: await preflightMysql(configMysql),
        };
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
      }
      default:
        throw noSetEnvMode();
    }

    repositoryContainer.init(this.mode, this.stores.main.instance);
  }
}

export const ctx = new Context();
