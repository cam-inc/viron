import store from 'store2';

export const KEY = {
  ENDPOINT_LIST: 'endpointList',
  ENDPOINT_GROUP_LIST: 'endpointGroupList',
  OAUTH_ENDPOINT_ID: 'oauthEndpointId',
} as const;
export type Key = typeof KEY[keyof typeof KEY];

export const get = function <T>(key: Key): T {
  return store.get(key);
};

export const set = function <T>(key: Key, value: T): T {
  return store.set(key, value);
};

export const remove = function <T>(key: Key): T {
  return store.remove(key);
};
