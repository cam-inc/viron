import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, genDynamicProvider, MongoConfig, MysqlConfig } from '.';
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
      authSource: 'admin',
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
      vironLib: mode == MODE.MONGO ? mongo : mysql,
    },
    cors: {
      allowOrigins: [
        'https://localhost:8000',
        'https://viron.work',
        'https://snapshot.viron.work',
      ],
    },
    csrf: {
      host: 'example.viron.work:3000',
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
        secret: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        provider: genDynamicProvider({
          oidc: {
            issuerUrl: process.env.OIDC_ISSUER_URL ?? '',
            clientId: process.env.OIDC_CLIENT_ID ?? '',
          },
          googleOAuth2: {
            issuerUrl: process.env.GOOGLE_OAUTH2_ISSUER_URL ?? '',
            clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID ?? '',
          },
          email: {
            jwtIssuer: process.env.EMAIL_JWT_ISSUER ?? '',
            jwtAudience: process.env.EMAIL_JWT_AUDIENCE ?? '',
          },
        }),
        expirationSec: 24 * 60 * 60,
      },
      googleOAuth2: {
        clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET ?? '',
        issuerUrl: process.env.GOOGLE_OAUTH2_ISSUER_URL ?? '',
        additionalScopes: [],
        userHostedDomains: [
          'cam-inc.co.jp',
          'sirok.co.jp',
          'toiro-system.com',
          'tapple.co.jp',
        ],
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
        bucketName: 'local-media.viron.work',
        mediaDomain: 'local-media.viron.work',
      },
    },
    oas: {
      infoExtentions: {
        [OAS_X_THEME]: THEME.AMBER,
        [OAS_X_THUMBNAIL]: 'https://example.com/logo.png',
        [OAS_X_TAGS]: ['example', 'nodejs'],
      },
    },
  };

  return ret;
};
