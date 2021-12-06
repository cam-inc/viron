import { get as _get, set as _set, remove as _remove } from 'store2';

export const KEY = {
  ENDPOINT_LIST: 'endpointList',
  OAUTH_ENDPOINT_ID: 'oauthEndpointId',
} as const;
export type Key = typeof KEY[keyof typeof KEY];

export const get = function <T>(key: Key): T {
  return _get(key);
};

export const set = function <T>(key: Key, value: T): T {
  return _set(key, value);
};

export const remove = function <T>(key: Key): T {
  return _remove(key);
};
