// configuration file.
import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import {
  domainsAuth,
  domainsOas,
  EMAIL_SIGNIN_PATH,
  unauthorized,
  COOKIE_KEY,
  OIDC_CALLBACK_PATH,
  OAUTH2_GOOGLE_CALLBACK_PATH,
} from '@viron/lib';
import { Mode, ServiceEnv, SERVICE_ENV, StoreType } from '../constants';
import { openUri } from '../infrastructures/mongo/connection';
import { get as getDevelopment } from './development';
import { get as getLocal } from './local';
import { get as getProduction } from './production';
import http from 'http';
import * as cookie from 'cookie';
import { ExegesisIncomingMessage } from '../application';

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

export interface ConfigCsrf {
  host: string;
  allowOrigins: string[];
  ignorePaths: string[];
}

export interface OasConfig {
  infoExtentions: domainsOas.VironInfoObjectExtentions;
}

export interface AWSConfig {
  s3: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
    mediaDomain: string;
  };
}

export interface Config {
  store: {
    main: MongoConfig | MysqlConfig;
    vironLib: MongoConfig | MysqlConfig;
  };
  cors: CorsConfig;
  csrf?: ConfigCsrf;
  auth: {
    multipleAuthUser: boolean;
    jwt: domainsAuth.JwtConfig;
    googleOAuth2: domainsAuth.GoogleOAuthConfig;
    oidc: domainsAuth.OidcConfig;
  };
  aws: AWSConfig;
  oas: OasConfig;
}

/**
 * Get configuration data.
 */
export const get = (mode: Mode, serviceEnv: ServiceEnv): Config => {
  let ret: Config;

  switch (serviceEnv) {
    case SERVICE_ENV.DEVELOPMENT:
      ret = getDevelopment();
      break;
    case SERVICE_ENV.PRODUCTION:
      ret = getProduction();
      break;
    default:
      ret = getLocal(mode);
      break;
  }

  return ret;
};

export const getBodyValue = async (
  req: http.IncomingMessage,
  key: string
): Promise<string> => {
  return (req as ExegesisIncomingMessage).body[key];
};

export const dynamicProvider = async (
  req: http.IncomingMessage
): Promise<{ issuer: string; audience: string[] }> => {
  switch (req.url) {
    case OIDC_CALLBACK_PATH: {
      const oidcClientId = await getBodyValue(req, 'clientId');
      if (oidcClientId === process.env.OIDC_CLIENT_ID) {
        return {
          issuer: process.env.OIDC_ISSUER_URL || '',
          audience: [process.env.OIDC_CLIENT_ID || ''],
        };
      }
      console.error(
        'oidcClientId is invalid',
        oidcClientId,
        process.env.OIDC_CLIENT_ID
      );
      throw unauthorized();
    }

    case OAUTH2_GOOGLE_CALLBACK_PATH: {
      const googleClientId = await getBodyValue(req, 'clientId');
      if (googleClientId === process.env.GOOGLE_OAUTH2_CLIENT_ID) {
        return {
          issuer: process.env.GOOGLE_OAUTH2_ISSUER_URL || '',
          audience: [process.env.GOOGLE_OAUTH2_CLIENT_ID || ''],
        };
      }
      console.error(
        'googleClientId is invalid',
        googleClientId,
        process.env.GOOGLE_OAUTH2_CLIENT_ID
      );
      throw unauthorized();
    }

    case EMAIL_SIGNIN_PATH: {
      return {
        issuer: process.env.EMAIL_JWT_ISSUER || '',
        audience: [process.env.EMAIL_JWT_AUDIENCE || ''],
      };
    }

    default: {
      const cookies = cookie.parse(req.headers.cookie || '');
      const token = cookies[COOKIE_KEY.VIRON_AUTHORIZATION];
      if (!token) {
        console.error('dynamicProvider token is invalid', cookies, req.url);
        throw unauthorized();
      }

      const claims = await domainsAuth.decodeJwt(token);
      if (!claims) {
        console.error('claims is invalid');
        throw unauthorized();
      }
      switch (
        (claims.aud as string[])[0] // audはsignで配列で入れている
      ) {
        case process.env.EMAIL_JWT_AUDIENCE:
          return {
            issuer: process.env.EMAIL_JWT_ISSUER || '',
            audience: [process.env.EMAIL_JWT_AUDIENCE || ''],
          };
        case process.env.OIDC_CLIENT_ID:
          return {
            issuer: process.env.OIDC_ISSUER_URL || '',
            audience: [process.env.OIDC_CLIENT_ID || ''],
          };
        case process.env.GOOGLE_OAUTH2_CLIENT_ID:
          return {
            issuer: process.env.GOOGLE_OAUTH2_ISSUER_URL || '',
            audience: [process.env.GOOGLE_OAUTH2_CLIENT_ID || ''],
          };
        default:
          console.error('aud is invalid', claims);
          throw unauthorized();
      }
    }
  }
};
