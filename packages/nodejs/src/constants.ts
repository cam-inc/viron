export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;
export type ApiMethod = (typeof API_METHOD)[keyof typeof API_METHOD];

export const AUTH_CONFIG_TYPE = {
  EMAIL: 'email',
  OAUTH: 'oauth',
  OIDC: 'oidc',
  OAUTH_CALLBACK: 'oauthcallback',
  OIDC_CALLBACK: 'oidccallback',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigType =
  (typeof AUTH_CONFIG_TYPE)[keyof typeof AUTH_CONFIG_TYPE];

export const AUTH_CONFIG_PROVIDER = {
  VIRON: 'viron',
  GOOGLE: 'google',
  OIDC: 'oidc',
  SIGNOUT: 'signout',
} as const;
export type AuthConfigProvider =
  (typeof AUTH_CONFIG_PROVIDER)[keyof typeof AUTH_CONFIG_PROVIDER];

export const STORE_TYPE = {
  MYSQL: 'mysql',
  MONGO: 'mongo',
} as const;
export type StoreType = (typeof STORE_TYPE)[keyof typeof STORE_TYPE];

export const HTTP_HEADER = {
  ACCESS_CONTROL_ALLOW_ORIGIN: 'access-control-allow-origin',
  ACCESS_CONTROL_ALLOW_CREDENTIALS: 'access-control-allow-credentials',
  ACCESS_CONTROL_ALLOW_METHODS: 'access-control-allow-methods',
  ACCESS_CONTROL_ALLOW_HEADERS: 'access-control-allow-headers',
  ACCESS_CONTROL_EXPOSE_HEADERS: 'access-control-expose-headers',
  CACHE_CONTROL: 'cache-control',
  CONTENT_DISPOSITION: 'content-disposition',
  CONTENT_TYPE: 'content-type',
  LOCATION: 'location',
  ORIGIN: 'origin',
  SET_COOKIE: 'set-cookie',
  X_REQUESTED_WITH: 'x-requested-with',
  X_VIRON_AUTHTYPES_PATH: 'x-viron-authtypes-path',
} as const;
export type HttpHeader = (typeof HTTP_HEADER)[keyof typeof HTTP_HEADER];

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
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;

export const ACCESS_CONTROL_ALLOW_CREDENTIALS = true;

export const ADMIN_ROLE = {
  SUPER: 'super',
  VIEWER: 'viewer',
} as const;
export type AdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];

export const VIRON_AUTHCONFIGS_PATH = '/viron/authconfigs';
export const EMAIL_SIGNIN_PATH = '/email/signin';
export const OAUTH2_GOOGLE_AUTHORIZATION_PATH = '/oauth2/google/authorization';
export const OAUTH2_GOOGLE_CALLBACK_PATH = '/oauth2/google/callback';
export const OIDC_AUTHORIZATION_PATH = '/oidc/authorization';
export const OIDC_CALLBACK_PATH = '/oidc/callback';
export const SIGNOUT_PATH = '/signout';

export const PERMISSION = {
  READ: 'read',
  WRITE: 'write',
  ALL: 'all',
  DENY: 'deny',
} as const;
export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION];

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
export const OAS_X_SKIP_AUDITLOG = 'x-skip-auditlog';

export const AUTH_TYPE = {
  EMAIL: 'email',
  GOOGLE: 'google',
  OIDC: 'oidc',
} as const;
export type AuthType = (typeof AUTH_TYPE)[keyof typeof AUTH_TYPE];

export const AUTH_SCHEME = 'Bearer';
export const JWT_HASH_ALGORITHM = 'HS512';
export const DEFAULT_JWT_EXPIRATION_SEC = 24 * 60 * 60;
export const DEBUG_LOG_PREFIX = '@viron/lib:';
export const CASBIN_SYNC_INTERVAL_MSEC = 1 * 60 * 1000;
export const OAUTH2_STATE_EXPIRATION_SEC = 10 * 60;
export const OIDC_STATE_EXPIRATION_SEC = 1 * 60;
export const OIDC_CODE_VERIFIER_EXPIRATION_SEC = 1 * 60;
export const REVOKED_TOKEN_RETENTION_SEC = 30 * 24 * 60 * 60;

export const COOKIE_KEY = {
  VIRON_AUTHORIZATION: 'viron_authorization',
  OAUTH2_STATE: 'oauth2_state',
  OIDC_STATE: 'oidc_state',
  OIDC_CODE_VERIFIER: 'oidc_code_verifier',
} as const;

export const GOOGLE_OAUTH2_DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
];

export const OIDC_DEFAULT_SCOPES = ['openid', 'email'];

export const THEME = {
  RED: 'red',
  ULTIMATE_ORANGE: 'ultimate orange',
  ORANGE_JUICE: 'orange juice',
  AMBER: 'amber',
  YELLOW: 'yellow',
  LIMONCELLO: 'limoncello',
  RADIUMM: 'radium',
  HARLEQUIN: 'harlequin',
  GREEN: 'green',
  LUCENT_LIME: 'lucent lime',
  GUPPIE_GREEN: 'guppie green',
  MINTY_PARADISE: 'minty paradise',
  AQUA: 'aqua',
  CAPRI: 'capri',
  BRESCIAN_BLUE: 'brescian blue',
  RARE_BLUE: 'rare blue',
  BLUE: 'blue',
  ELECTRIC_ULTRAMARINE: 'electric ultramarine',
  VIOLENT_VIOLET: 'violent violet',
  ELECTRIC_PURPLE: 'electric purple',
  MAGENDA: 'magenta',
  BRUTAL_PINK: 'brutal pink',
  NEON_ROSE: 'neon rose',
  ELECTRIC_CRIMSON: 'electric crimson',
} as const;
export type Theme = (typeof THEME)[keyof typeof THEME];

export const X_PAGE_CONTENT_TYPE = {
  NUMBER: 'number',
  TABLE: 'table',
  CUSTOM: 'custom',
} as const;
export type XPageContentType =
  (typeof X_PAGE_CONTENT_TYPE)[keyof typeof X_PAGE_CONTENT_TYPE];

export const TABLE_SORT_DELIMITER = ':';
export const TABLE_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
export type TableSortOrder =
  (typeof TABLE_SORT_ORDER)[keyof typeof TABLE_SORT_ORDER];

export const CACHE_CONTROL = {
  NO_STORE: 'no-store',
} as const;

export const VIRON_DOMAINS = {
  ADMINACCOUNTS: 'adminaccounts',
  ADMINROLES: 'adminroles',
  ADMINUSERS: 'adminusers',
  AUDITLOGS: 'auditlogs',
  AUTH: 'auth',
  AUTHCONFIGS: 'authconfigs',
  OAS: 'oas',
} as const;
export type VironDomains = (typeof VIRON_DOMAINS)[keyof typeof VIRON_DOMAINS];
