import store from 'store2';

export type Key = 'endpointList' | 'foo';

export const get = function <T>(key: Key): T {
  return store.local.get(key);
};

export const set = function <T>(key: Key, value: T): T {
  return store.local.set(key, value);
};

export const remove = function <T>(key: Key): T {
  return store.local.remove(key);
};
