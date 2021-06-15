export const MODE_MYSQL = 'mysql';
export const MODE_MONGO = 'mongo';
export type Mode = typeof MODE_MYSQL | typeof MODE_MONGO;
export type StoreType = Mode;

export const AUTHENTICATION_RESULT_TYPE = {
  SUCCESS: 'success',
  INVALID: 'invalid',
} as const;
