import { AtomEffect, DefaultValue } from 'recoil';
import { get, Key, remove, set } from '$storage/index';

// For detail about Atom Effects,
// @see: https://recoiljs.org/docs/guides/atom-effects

// Make atom data in sync with local stored data for persistence.
export const localStoragePersistence =
  <T>(key: Key): AtomEffect<T> =>
  ({ trigger, setSelf, onSet }) => {
    if (trigger === 'get') {
      setSelf(get<T>(key));
    }
    /*
  const savedValue = get<T>(key);
  if (savedValue !== null) {
    setSelf(savedValue);
  }
  */
    onSet((newValue) => {
      set<T>(key, newValue);
      /*
    if (newValue instanceof DefaultValue) {
      remove<T>(key);
    } else {
      set<T>(key, newValue);
    }
    */
    });
  };
