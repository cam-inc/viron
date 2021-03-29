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
};
export type Style = typeof STYLE[keyof typeof STYLE];

export const AUTH_TYPE = {
  EMAIL: 'email',
  OAUTH: 'oauth',
  SIGNOUT: 'signout',
};
export type AuthTypeType = typeof AUTH_TYPE[keyof typeof AUTH_TYPE];

export const AUTH_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
};
export type AuthTypeMethod = typeof AUTH_METHOD[keyof typeof AUTH_METHOD];
