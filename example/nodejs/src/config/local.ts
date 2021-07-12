import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, MongoConfig, MysqlConfig } from '.';
import { Mode, MODE } from '../constants';

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
      main: mode == MODE.MONGO ? mongo : mysql,
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
