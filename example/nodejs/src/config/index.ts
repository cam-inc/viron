// configuration file.
import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import { domainsAuth, domainsOas } from '@viron/lib';
import { Mode, ServiceEnv, SERVICE_ENV, StoreType } from '../constants';
import { openUri } from '../infrastructures/mongo/connection';
import { get as getDevelopment } from './development';
import { get as getLocal } from './local';
import { get as getProduction } from './production';

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
  auth: {
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
