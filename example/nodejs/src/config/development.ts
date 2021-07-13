import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, MongoConfig } from '.';

/**
 * Get configuration data.
 */
export const get = (): Config => {
  const mongo: MongoConfig = {
    type: 'mongo',
    openUri:
      'mongodb://development-docdb-cluster.in.viron.work:27017?replicaSet=rs0&readPreference=secondaryPreferred',
    connectOptions: {
      // MongoDB Options
      dbName: 'viron_example',
      autoIndex: true,
      user: process.env.MONGODB_USER_NAME,
      pass: process.env.MONGODB_USER_PASSWORD,
      useNewUrlParser: true,
      useCreateIndex: true,
      authSource: 'admin',
      useFindAndModify: false,
      useUnifiedTopology: true,
      ssl: true,
      sslValidate: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sslCA: process.env.DOCDB_SSL_CA,
    },
  };

  const ret: Config = {
    store: {
      main: mongo,
    },
    cors: {
      allowOrigins: ['https://localhost:8000', 'https://viron.work'],
    },
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET ?? '',
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
