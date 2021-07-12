// configuration file.
import { ConnectOptions as MongoConnectOptions } from 'mongoose';
import { Options as MysqlConnectOptions } from 'sequelize';
import { domainsAuth, domainsOas } from '@viron/lib';
import { Mode, ServiceEnv, SERVICE_ENV, StoreType } from '../constants';
import { openUri } from '../stores/connection/mongo';
import { get as getDevelopment } from './development';
import { get as getLocal } from './local';

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
export const get = (mode: Mode, serviceEnv: ServiceEnv): Config => {
  let ret: Config;

  switch (serviceEnv) {
    case SERVICE_ENV.DEVELOPMENT:
      ret = getDevelopment();
      break;
    //case SERVICE_ENV.PRODUCTION:
    //  ret = getProduction(mode);
    //  break;
    default:
      ret = getLocal(mode);
      break;
  }

  return ret;
};
