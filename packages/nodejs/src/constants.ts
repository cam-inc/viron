export const COLOR = {
  WHITE: 'white',
  BLACK: 'black',
  PURPLE: 'purple',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
  GRAY: 'gray',
} as const;
export type Color = typeof COLOR[keyof typeof COLOR];

export const THEME = {
  STANDARD: 'standard',
  MIDNIGHT: 'midnight',
  TERMINAL: 'terminal',
} as const;
export type Theme = typeof THEME[keyof typeof THEME];

export const SECTION = {
  MANAGE: 'manage',
  DASHBOARD: 'dashboard',
} as const;
export type Section = typeof SECTION[keyof typeof SECTION];

export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;
export type ApiMethod = typeof API_METHOD[keyof typeof API_METHOD];

export const QUERY_TYPE = {
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  DATETIME: 'datetime',
  TIME: 'time',
} as const;
export type QueryType = typeof QUERY_TYPE[keyof typeof QUERY_TYPE];

export const STYLE = {
  NUMBER: 'number',
  LIST: 'list',
  TABLE: 'table',
  CHART: 'chart',
  EXPLORER: 'explorer',
} as const;
export type Style = typeof STYLE[keyof typeof STYLE];

export const AUTH_CONFIG_TYPE = {
  EMAIL: 'email',
  OAUTH: 'oauth',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigType = typeof AUTH_CONFIG_TYPE[keyof typeof AUTH_CONFIG_TYPE];

export const AUTH_CONFIG_PROVIDER = {
  VIRON: 'viron',
  GOOGLE: 'google',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigProvider = typeof AUTH_CONFIG_PROVIDER[keyof typeof AUTH_CONFIG_PROVIDER];

export const AUTH_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
};
export type AuthMethod = typeof AUTH_METHOD[keyof typeof AUTH_METHOD];

export const STORE_TYPE = {
  MYSQL: 'mysql',
  MONGO: 'mongo',
} as const;
export type StoreType = typeof STORE_TYPE[keyof typeof STORE_TYPE];

export const HTTP_HEADER = {
  X_VIRON_AUTHTYPES_PATH: 'x-viron-authtypes-path',
  ACCESS_CONTROL_ALLOW_ORIGIN: 'access-control-allow-origin',
  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'access-control-allow-credentials',
  ACCESS_CONTROL_ALLOW_METHODS: 'access-control-allow-methods',
  ACCESS_CONTROL_ALLOW_HEADERS: 'access-control-allow-headers',
  ACCESS_CONTROL_EXPOSE_HEADERS: 'access-control-expose-headers',
  AUTHORIZATION: 'authorization',
} as const;
export type HttpHeader = typeof HTTP_HEADER[keyof typeof HTTP_HEADER];

export const DEFAULT_PAGER_SIZE = 10;
export const DEFAULT_PAGER_PAGE = 1;

export const ACCESS_CONTROL_ALLOW_HEADERS = [
  'x-requested-with',
  'origin',
  'authorization',
] as const;

export const ACCESS_CONTROL_EXPOSE_HEADERS = [
  'content-disposition',
  'x-requested-with',
  'origin',
  'authorization',
] as const;

export const ACCESS_CONTROL_ALLOW_METHODS = [
  'GET',
  'PUT',
  'POST',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export const ACCESS_CONTROL_ALLOW_CREDENTIALS = true;

export const ADMIN_ROLE = {
  SUPER: 'super',
  VIEWER: 'viewer',
} as const;
export type AdminRole = typeof ADMIN_ROLE[keyof typeof ADMIN_ROLE];

export const VIRON_AUTHCONFIGS_PATH = '/viron/authconfigs';
export const EMAIL_SIGNIN_PATH = '/email/signin';
export const GOOGLE_SIGNIN_PATH = '/google/signin';
export const SIGNOUT_PATH = '/signout';

export const PERMISSION = {
  READ: 'read',
  WRITE: 'write',
  DENY: 'deny',
} as const;
export type Permission = typeof PERMISSION[keyof typeof PERMISSION];

export const RESOURCE_DELIMITER = ':';

export const OAS_X_PAGES = 'x-pages';

export const AUTH_TYPE = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const;
export type AuthType = typeof AUTH_TYPE[keyof typeof AUTH_TYPE];

export const AUTH_SCHEME = 'Bearer';
export const JWT_HASH_ALGORITHM = 'HS512';
export const DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60;
export const DEBUG_LOG_PREFIX = '@viron/lib:';
