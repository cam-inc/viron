import { atom } from 'recoil';
import { Info } from '$types/oas';

const name = 'app';

export const isLaunchedState = atom<boolean>({
  key: `${name}.isLaunched`,
  default: false,
});

export const themeState = atom<Info['x-theme'] | null>({
  key: `${name}.theme`,
  default: null,
});
