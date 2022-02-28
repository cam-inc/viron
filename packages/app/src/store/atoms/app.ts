import { atom } from 'recoil';
import { Theme, THEME } from '~/types/oas';

const NAME = 'app';
const KEY = {
  IS_LAUNCHED: 'isLaunched',
  SCREEN: 'screen',
  THEME: 'theme',
} as const;

export const isLaunched = atom<boolean>({
  key: `${NAME}.${KEY.IS_LAUNCHED}`,
  default: false,
});

type Screen = { width: number; height: number; lg: boolean };
export const screen = atom<Screen>({
  key: `${NAME}.${KEY.SCREEN}`,
  default: {
    width: 0,
    height: 0,
    lg: false,
  },
});

export const theme = atom<Theme>({
  key: `${NAME}.${KEY.THEME}`,
  default: THEME.BLUE,
});
