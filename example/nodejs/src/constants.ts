export const MODE = {
  MYSQL: 'mysql',
  MONGO: 'mongo',
} as const;
export type Mode = (typeof MODE)[keyof typeof MODE];
export type StoreType = Mode;

export const SERVICE_ENV = {
  LOCAL: 'local',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};
export type ServiceEnv = (typeof SERVICE_ENV)[keyof typeof SERVICE_ENV];

export const AUTHENTICATION_RESULT_TYPE = {
  SUCCESS: 'success',
  INVALID: 'invalid',
} as const;

export const LIMIT_MEDIA_FILE_SIZE = 2000000;

export const CSRF_IGNORE_HTTP_METHODS = ['HEAD', 'OPTIONS'];
