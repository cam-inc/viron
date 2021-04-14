import { atom } from 'recoil';

const name = 'app';

export const isLaunchedState = atom<boolean>({
  key: `${name}.isLaunched`,
  default: false,
});
