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
  const oidcClientId = process.env.OIDC_CLIENT_ID;
  const oidcClientSecret = process.env.OIDC_CLIENT_SECRET;
  const oidcIssuerUrl = process.env.OIDC_ISSUER_URL;
  const googleOAuth2ClientId = process.env.GOOGLE_OAUTH2_CLIENT_ID;
  const googleOAuth2ClientSecret = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
  const googleOAuth2IssuerUrl = process.env.GOOGLE_OAUTH2_ISSUER_URL;
  const emailJwtIssuer = process.env.EMAIL_JWT_ISSUER;
  const emailJwtAudience = process.env.EMAIL_JWT_AUDIENCE;
  if (!emailJwtIssuer || !emailJwtAudience) {
    console.error('Email JWT configuration is missing', emailJwtIssuer);
    throw unauthorized();
  }
  if (!oidcClientId || !oidcClientSecret || !oidcIssuerUrl) {
    console.error('OIDC configuration is missing', oidcClientId);
    throw unauthorized();
  }
  if (
    !googleOAuth2ClientId ||
    !googleOAuth2ClientSecret ||
    !googleOAuth2IssuerUrl
  ) {
    console.error(
      'Google OAuth2 configuration is missing',
      googleOAuth2ClientId
    );
    throw unauthorized();
  }

  switch (req.url) {
    case OIDC_CALLBACK_PATH: {
      const clientId = await getBodyValue(req, 'clientId');
      if (clientId !== oidcClientId) {
        console.error('OIDC post clientId is missing', clientId);
        throw unauthorized();
      }
      return {
        issuer: oidcIssuerUrl,
        audience: [oidcClientId],
      };
    }

    case OAUTH2_GOOGLE_CALLBACK_PATH: {
      const clientId = await getBodyValue(req, 'clientId');
      if (clientId !== googleOAuth2ClientId) {
        console.error('Google OAuth2 post clientId is missing', clientId);
        throw unauthorized();
      }
      return {
        issuer: googleOAuth2IssuerUrl,
        audience: [googleOAuth2ClientId],
      };
    }

    case EMAIL_SIGNIN_PATH: {
      return {
        issuer: emailJwtIssuer,
        audience: [emailJwtAudience],
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
            issuer: emailJwtIssuer,
            audience: [emailJwtAudience],
          };
        case process.env.OIDC_CLIENT_ID:
          return {
            issuer: oidcIssuerUrl,
            audience: [oidcClientId],
          };
        case process.env.GOOGLE_OAUTH2_CLIENT_ID:
          return {
            issuer: googleOAuth2IssuerUrl,
            audience: [googleOAuth2ClientId],
          };
        default:
          console.error('aud is invalid', claims);
          throw unauthorized();
      }
    }
  }
};
