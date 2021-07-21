export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;
export type ApiMethod = typeof API_METHOD[keyof typeof API_METHOD];

export const AUTH_CONFIG_TYPE = {
  EMAIL: 'email',
  OAUTH: 'oauth',
  OAUTH_CALLBACK: 'oauthcallback',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigType =
  typeof AUTH_CONFIG_TYPE[keyof typeof AUTH_CONFIG_TYPE];

export const AUTH_CONFIG_PROVIDER = {
  VIRON: 'viron',
  GOOGLE: 'google',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigProvider =
  typeof AUTH_CONFIG_PROVIDER[keyof typeof AUTH_CONFIG_PROVIDER];

export const STORE_TYPE = {
  MYSQL: 'mysql',
  MONGO: 'mongo',
} as const;
export type StoreType = typeof STORE_TYPE[keyof typeof STORE_TYPE];

export const HTTP_HEADER = {
  ACCESS_CONTROL_ALLOW_ORIGIN: 'access-control-allow-origin',
  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'access-control-allow-credentials',
  ACCESS_CONTROL_ALLOW_METHODS: 'access-control-allow-methods',
  ACCESS_CONTROL_ALLOW_HEADERS: 'access-control-allow-headers',
  ACCESS_CONTROL_EXPOSE_HEADERS: 'access-control-expose-headers',
  CONTENT_DISPOSITION: 'content-disposition',
  CONTENT_TYPE: 'content-type',
  LOCATION: 'location',
  ORIGIN: 'origin',
  SET_COOKIE: 'set-cookie',
  X_REQUESTED_WITH: 'x-requested-with',
  X_VIRON_AUTHTYPES_PATH: 'x-viron-authtypes-path',
} as const;
export type HttpHeader = typeof HTTP_HEADER[keyof typeof HTTP_HEADER];

export const DEFAULT_PAGER_SIZE = 10;
export const DEFAULT_PAGER_PAGE = 1;

export const ACCESS_CONTROL_ALLOW_HEADERS = [
  HTTP_HEADER.CONTENT_TYPE,
  HTTP_HEADER.ORIGIN,
] as const;

export const ACCESS_CONTROL_EXPOSE_HEADERS = [
  HTTP_HEADER.CONTENT_DISPOSITION,
  HTTP_HEADER.ORIGIN,
  HTTP_HEADER.X_REQUESTED_WITH,
  HTTP_HEADER.X_VIRON_AUTHTYPES_PATH,
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
export const OAUTH2_GOOGLE_AUTHORIZATION_PATH = '/oauth2/google/authorization';
export const OAUTH2_GOOGLE_CALLBACK_PATH = '/oauth2/google/callback';
export const SIGNOUT_PATH = '/signout';

export const PERMISSION = {
  READ: 'read',
  WRITE: 'write',
  DENY: 'deny',
} as const;
export type Permission = typeof PERMISSION[keyof typeof PERMISSION];

export const OAS_X_THUMBNAIL = 'x-thumbnail';
export const OAS_X_THEME = 'x-theme';
export const OAS_X_TAGS = 'x-tags';
export const OAS_X_TABLE = 'x-table';
export const OAS_X_PAGES = 'x-pages';
export const OAS_X_PAGE_CONTENTS = 'contents';
export const OAS_X_PAGE_CONTENT_RESOURCE_ID = 'resourceId';
export const OAS_X_AUTOCOMPLETE = 'x-autocomplete';
export const OAS_X_AUTHCONFIG_DEFAULT_PARAMETERS =
  'x-authconfig-default-parameters';
export const OAS_X_AUTHCONFIG_DEFAULT_REQUESTBODY =
  'x-authconfig-default-requestBody';

export const AUTH_TYPE = {
  EMAIL: 'email',
  GOOGLE: 'google',
} as const;
export type AuthType = typeof AUTH_TYPE[keyof typeof AUTH_TYPE];

export const AUTH_SCHEME = 'Bearer';
export const JWT_HASH_ALGORITHM = 'HS512';
export const DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60;
export const DEBUG_LOG_PREFIX = '@viron/lib:';
export const CASBIN_SYNC_INTERVAL_MSEC = 1 * 60 * 1000;
export const OAUTH2_STATE_EXPIRATION_SEC = 10 * 60;
export const REVOKED_TOKEN_RETENTION_SEC = 30 * 24 * 60 * 60;

export const COOKIE_KEY = {
  VIRON_AUTHORIZATION: 'viron_authorization',
  OAUTH2_STATE: 'oauth2_state',
} as const;

export const GOOGLE_OAUTH2_DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
];

export const THEME = {
  STANDARD: 'standard',
  MIDNIGHT: 'midnight',
  TERMINAL: 'terminal',
} as const;
export type Theme = typeof THEME[keyof typeof THEME];

export const TABLE_SORT_DELIMITER = ':';

export const ADMIN_USER_ID_ME = 'me';
