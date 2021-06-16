// configuration file.
import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import {
  domainsAuth,
  domainsOas,
  OAS_X_TAGS,
  OAS_X_THEME,
  OAS_X_THUMBNAIL,
  THEME,
} from '@viron/lib';
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

export interface OasConfig {
  infoExtentions: domainsOas.VironInfoObjectExtentions;
}

export interface Config {
  store: {
    main: MongoConfig | MysqlConfig;
  };
  cors: CorsConfig;
  auth: {
    jwt: domainsAuth.JwtConfig;
    googleOAuth2: domainsAuth.GoogleOAuthConfig;
  };
  oas: OasConfig;
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
      allowOrigins: ['https://localhost:8000'],
    },
    auth: {
      jwt: {
        secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        provider: 'viron-example-nodejs',
        expirationSec: 24 * 60 * 60,
      },
      googleOAuth2: {
        clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID ?? '',

        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET ?? '',
        additionalScopes: [],
        userHostedDomains: ['cam-inc.co.jp', 'cyberagent.co.jp'],
      },
    },
    oas: {
      infoExtentions: {
        [OAS_X_THEME]: THEME.STANDARD,
        [OAS_X_THUMBNAIL]: 'https://example.com/logo.png',
        [OAS_X_TAGS]: ['example', 'nodejs'],
      },
    },
  };

  return ret;
};
