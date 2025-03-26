import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, MongoConfig, dynamicProvider } from '.';

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
      vironLib: mongo,
    },
    cors: {
      allowOrigins: [
        'https://localhost:8000',
        'https://viron.work',
        'https://snapshot.viron.work',
      ],
    },
    csrf: {
      host: 'demo.viron.work',
      allowOrigins: [
        'https://localhost:8000',
        'https://viron.work',
        'https://snapshot.viron.work',
      ],
      ignorePaths: [
        '/ping',
        '/oidc/authorization',
        '/oauth2/google/authorization',
      ],
    },
    auth: {
      multipleAuthUser: process.env.MULTIPLE_AUTH_USER === 'true',
      jwt: {
        secret: process.env.JWT_SECRET ?? '',
        provider: dynamicProvider,
        expirationSec: 24 * 60 * 60,
      },
      googleOAuth2: {
        clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET ?? '',
        issuerUrl: process.env.GOOGLE_OAUTH2_ISSUER_URL ?? '',
        additionalScopes: [],
        userHostedDomains: process.env.GOOGLE_OAUTH2_USER_HOSTED_DOMAINS
          ? process.env.GOOGLE_OAUTH2_USER_HOSTED_DOMAINS.split(',')
          : [],
      },
      oidc: {
        clientId: process.env.OIDC_CLIENT_ID ?? '',
        clientSecret: process.env.OIDC_CLIENT_SECRET ?? '',
        issuerUrl: process.env.OIDC_ISSUER_URL ?? '',
        additionalScopes: [],
        userHostedDomains: process.env.OIDC_USER_HOSTED_DOMAINS
          ? process.env.OIDC_USER_HOSTED_DOMAINS.split(',')
          : [],
      },
    },
    aws: {
      s3: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? '',
        region: 'ap-northeast-1',
        bucketName: 'development-media.viron.work',
        mediaDomain: 'media.viron.work',
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
