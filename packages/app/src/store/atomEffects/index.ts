import { AtomEffect } from 'recoil';
import { get, Key, set } from '~/storage';

// For detail about Atom Effects,
// @see: https://recoiljs.org/docs/guides/atom-effects

// Make atom data in sync with local stored data for persistence.
export const localStoragePersistence =
  <T>(key: Key, fallback: T): AtomEffect<T> =>
  ({ trigger, setSelf, onSet }) => {
    if (trigger === 'get') {
      setSelf(get<T>(key) ?? fallback);
    }
    onSet((newValue) => {
      set<T>(key, newValue);
    });
  };
