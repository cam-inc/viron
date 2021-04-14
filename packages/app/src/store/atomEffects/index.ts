import { AtomEffect, DefaultValue } from 'recoil';
import { get, remove, set, Key } from '$storage/index';

export const localStoragePersistenceEffect = function <T>(
  key: Key
): AtomEffect<T> {
  return function ({ setSelf, onSet }): void {
    const savedValue = get<T>(key);
    if (savedValue !== null) {
      setSelf(savedValue);
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        remove<T>(key);
      } else {
        set<T>(key, newValue);
      }
    });
  };
};
