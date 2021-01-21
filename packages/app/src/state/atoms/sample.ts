import { atom } from 'recoil';

export const foo = atom<string>({
  key: 'foo',
  default: 'foo',
});
