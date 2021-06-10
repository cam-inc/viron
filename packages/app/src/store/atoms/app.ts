import { atom } from 'recoil';
import { Info } from '$types/oas';

const name = 'app';

export const isLaunchedState = atom<boolean>({
  key: `${name}.isLaunched`,
  default: false,
});

type Screen = { width: number; height: number; lg: boolean };
export const screenState = atom<Screen>({
  key: `${name}.screen`,
  default: {
    width: 0,
    height: 0,
    lg: false,
  },
});

export const themeState = atom<Info['x-theme'] | null>({
  key: `${name}.theme`,
  default: null,
});
