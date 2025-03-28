import { OAS_X_TAGS, OAS_X_THEME, OAS_X_THUMBNAIL, THEME } from '@viron/lib';
import { Config, MongoConfig, genDynamicProvider } from '.';

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
      allowOrigins: ['https://viron.plus', 'https://snapshot.viron.plus'],
    },
    csrf: {
      host: 'demo.viron.plus',
      allowOrigins: ['https://viron.plus', 'https://snapshot.viron.plus'],
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
        provider: genDynamicProvider({
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
        userHostedDomains: process.env.GOOGLE_OAUTH2_USER_HOSTED_DOMAINS
          ? process.env.GOOGLE_OAUTH2_USER_HOSTED_DOMAINS.split(',')
          : [],
      },
      // 本番demoではOIDCのIdpが準備できないので設定なしにする
      oidc: {
        clientId: '',
        clientSecret: '',
        issuerUrl: '',
        additionalScopes: [],
        userHostedDomains: [],
      },
    },
    aws: {
      s3: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_S3_SECRET_KEY ?? '',
        region: 'ap-northeast-1',
        bucketName: 'production-media.viron.plus',
        mediaDomain: 'media.viron.plus',
      },
    },
    oas: {
      infoExtentions: {
        [OAS_X_THEME]: THEME.BRUTAL_PINK,
        [OAS_X_THUMBNAIL]: 'https://example.com/logo.png',
        [OAS_X_TAGS]: ['example', 'nodejs'],
      },
    },
  };

  return ret;
};
