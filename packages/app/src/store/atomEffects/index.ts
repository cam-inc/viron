import { AtomEffect, DefaultValue } from 'recoil';

export const localStoragePersistenceEffect = function <T>(
  key: string
): AtomEffect<T> {
  return function ({ setSelf, onSet }): void {
    const savedValue = localStorage.getItem(key);
    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };
};
