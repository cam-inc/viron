import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, MongoConfig } from '.';

/**
 * Get configuration data.
 */
export const get = (): Config => {
  const mongo: MongoConfig = {
    type: 'mongo',
    openUri: process.env.MONGODB_CONNECTION_URI || '',
    connectOptions: {
      // MongoDB Options
      dbName: 'viron_example',
      autoIndex: true,
      user: process.env.MONGODB_USER_NAME,
      pass: process.env.MONGODB_USER_PASSWORD,
      authSource: 'admin',
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
      allowOrigins: [
        'https://localhost:8000',
        'https://viron.work',
        'https://snapshot.viron.work',
      ],
    },
    auth: {
      jwt: {
        secret: process.env.JWT_SECRET ?? '',
        provider: 'dev-viron-example-nodejs',
        expirationSec: 24 * 60 * 60,
      },
      googleOAuth2: {
        clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID ?? '',

        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET ?? '',
        additionalScopes: [],
        userHostedDomains: ['cam-inc.co.jp', 'cyberagent.co.jp'],
      },
    },
    aws: {
      s3: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? '',
        region: 'ap-northeast-1',
        bucketName: 'local-media.viron.work',
        mediaDomain: 'local-media.viron.work',
      },
    },
    oas: {
      infoExtentions: {
        [OAS_X_THEME]: THEME.GUPPIE_GREEN,
        [OAS_X_THUMBNAIL]: 'https://example.com/logo.png',
        [OAS_X_TAGS]: ['example', 'nodejs'],
      },
    },
  };

  return ret;
};
