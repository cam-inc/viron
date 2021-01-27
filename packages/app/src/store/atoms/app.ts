import { atom } from 'recoil';

const name = 'app';

export const isLaunched = atom<boolean>({
  key: `${name}.isLaunched`,
  default: false,
});
