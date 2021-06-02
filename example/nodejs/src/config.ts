// configuration file.
import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import { domainsAuth } from '@viron/lib';
import { Mode, MODE_MONGO, StoreType } from './constants';
import { openUri } from './stores/connection/mongo';

export interface MongoConfig extends StoreConfig {
  openUri: openUri;
  connectOptions: MongoConnectOptions;
}

export interface MysqlConfig extends StoreConfig {
  connectOptions: MysqlConnectOptions;
}

export interface StoreConfig {
  type: StoreType;
}

export interface CorsConfig {
  allowOrigins: string[];
}

export interface Config {
  store: {
    main: MongoConfig | MysqlConfig;
  };
  cors: CorsConfig;
  auth: {
    jwt: domainsAuth.JwtConfig;
  };
}

/**
 * Get configuration data.
 */
export const get = (mode: Mode): Config => {
  const mongo: MongoConfig = {
    type: 'mongo',
    openUri: 'mongodb://mongo:27017',
    connectOptions: {
      // MongoDB Options
      dbName: 'viron_example',
      autoIndex: true,
      user: 'root',
      pass: 'password',
      useNewUrlParser: true,
      useCreateIndex: true,
      authSource: 'admin',
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  };

  const mysql: MysqlConfig = {
    type: 'mysql',
    connectOptions: {
      dialect: 'mysql',
      database: 'viron_example',
      username: 'root',
      password: 'password',
      host: 'mysql',
      port: 3306,
      ssl: false,
      protocol: 'tcp',
      logging: true,
    },
  };
  const ret: Config = {
    store: {
      main: mode == MODE_MONGO ? mongo : mysql,
    },
    cors: {
      // TODO: 正規のドメイン取得したら修正
      allowOrigins: ['https://localhost:8000'],
    },
    auth: {
      jwt: {
        secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        provider: 'viron-example-nodejs',
      },
    },
  };

  return ret;
};
