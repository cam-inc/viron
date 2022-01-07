import { atom } from 'recoil';
import { X_Theme, X_THEME } from '~/types/oas';
import { isBrowser } from '~/utils';

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

export const theme = atom<X_Theme>({
  key: `${NAME}.${KEY.THEME}`,
  default: X_THEME.RED,
  // TODO: 消す
  effects_UNSTABLE: [
    // Keep the stored data and the body element's attribute in sync for css styles to be applied.
    ({ onSet }) => {
      onSet((newValue) => {
        if (!isBrowser) {
          return;
        }
        const bodyElm = document.querySelector('body');
        if (!bodyElm) {
          return;
        }
        // TODO: 消す
        bodyElm.dataset.theme = newValue;
      });
    },
  ],
});
