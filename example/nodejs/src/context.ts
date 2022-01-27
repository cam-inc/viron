import pino from 'pino';
import { Sequelize } from 'sequelize';
import { repositoryContainer, domainsAuth } from '@viron/lib';
import { Mode, MODE, ServiceEnv, SERVICE_ENV } from './constants';
import {
  MongoStore,
  init as initMongo,
} from './infrastructures/mongo/connection';
import {
  MysqlStore,
  init as initMysql,
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

  public async init(): Promise<void> {
    await this.initStore();
    await loadSampleData();
    domainsAuth.initJwt(this.config.auth.jwt);
  }

  /**
   * Store initialization
   */
  public async initStore(): Promise<void> {
    const { main: configMain, vironLib: configVironLib } = this.config.store;

    switch (this.mode) {
      case MODE.MONGO: {
        // eslint-disable-next-line no-case-declarations
        const configMongo = configMain as MongoConfig;
        this.stores = {
          main: await initMongo(configMongo),
        };
        logger.info(
          `Completed loading the store (main). type=${configMongo.type}, openUri=${configMongo.openUri}`
        );
        break;
      }
      case MODE.MYSQL: {
        // eslint-disable-next-line no-case-declarations
        const configMysql = configMain as MysqlConfig;
        this.stores = {
          main: await initMysql(configMysql),
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

    await repositoryContainer.init(this.mode, undefined, configVironLib);
  }
}

export const ctx = new Context();
