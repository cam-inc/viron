import resolveConfig from 'tailwindcss/resolveConfig';
// @ts-ignore
import tailwindConfig from '../../../../tailwind.config.js';
import { Depth, HEX, Level, Mode, Opacity, Palette } from '../_types/index';

const config = resolveConfig(tailwindConfig);

type ConfigPalette = Record<
  Palette,
  {
    '50': HEX;
    '100': HEX;
    '200': HEX;
    '300': HEX;
    '400': HEX;
    '500': HEX;
    '600': HEX;
    '700': HEX;
    '800': HEX;
    '900': HEX;
    A100: HEX;
    A200: HEX;
    A400: HEX;
    A700: HEX;
  }
>;
// @ts-ignore
const configPalette: ConfigPalette = config?.theme.colors // @ts-ignore
  .palette as ConfigPalette;

export const PALETTE = {
  RED: 'red',
  PINK: 'pink',
  PURPLE: 'purple',
  DEEP_PURPLE: 'deepPurple',
  INDIGO: 'indigo',
  BLUE: 'blue',
  LIGHT_BLUE: 'lightBlue',
  CYAN: 'cyan',
  TEAL: 'teal',
  GREEN: 'green',
  LIGHT_GREEN: 'lightGreen',
  LIME: 'lime',
  YELLOW: 'yellow',
  AMBER: 'amber',
  ORANGE: 'orange',
  DEEP_ORANGE: 'deepOrange',
  BROWN: 'brown',
  GRAY: 'gray',
  BLUE_GRAY: 'blueGray',
} as const;

export const MODE = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export const BACKGROUND: Record<Mode, HEX> = {
  [MODE.LIGHT]: '#F8F8F8',
  [MODE.DARK]: '#121212',
};

export const ERROR: HEX = '#B00020';

export const OVERLAY = {
  [MODE.LIGHT]: '#000000',
  [MODE.DARK]: '#FFFFFF',
};

export const PRIMARY: Record<Mode, Record<Palette, HEX>> = {
  [MODE.LIGHT]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['900'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['900'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['900'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['900'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['900'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['900'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['900'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['900'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['900'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['900'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['900'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['900'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['900'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['900'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['900'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['900'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['900'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['900'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['900'],
  },
  [MODE.DARK]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['A400'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['A400'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['A400'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['A400'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['A400'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['A400'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['A400'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['A400'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['A400'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['A400'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['A400'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['A400'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['A400'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['A400'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['A400'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['A400'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['A400'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['A400'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['A400'],
  },
};

export const PRIMARY_VARIANT: Record<Mode, Record<Palette, HEX>> = {
  [MODE.LIGHT]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['800'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['800'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['800'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['800'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['800'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['800'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['800'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['800'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['800'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['800'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['800'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['800'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['800'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['800'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['800'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['800'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['800'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['800'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['800'],
  },
  [MODE.DARK]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['A700'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['A700'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['A700'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['A700'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['A700'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['A700'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['A700'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['A700'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['A700'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['A700'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['A700'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['A700'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['A700'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['A700'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['A700'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['A700'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['A700'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['A700'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['A700'],
  },
};

export const SECONDARY: Record<Mode, Record<Palette, HEX>> = {
  [MODE.LIGHT]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['700'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['700'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['700'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['700'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['700'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['700'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['700'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['700'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['700'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['700'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['700'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['700'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['700'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['700'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['700'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['700'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['700'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['700'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['700'],
  },
  [MODE.DARK]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['A100'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['A100'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['A100'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['A100'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['A100'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['A100'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['A100'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['A100'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['A100'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['A100'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['A100'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['A100'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['A100'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['A100'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['A100'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['A100'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['A100'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['A100'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['A100'],
  },
};

export const SECONDARY_VARIANT: Record<Mode, Record<Palette, HEX>> = {
  [MODE.LIGHT]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['600'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['600'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['600'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['600'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['600'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['600'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['600'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['600'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['600'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['600'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['600'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['600'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['600'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['600'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['600'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['600'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['600'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['600'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['600'],
  },
  [MODE.DARK]: {
    [PALETTE.RED]: configPalette[PALETTE.RED]['A200'],
    [PALETTE.PINK]: configPalette[PALETTE.PINK]['A200'],
    [PALETTE.PURPLE]: configPalette[PALETTE.PURPLE]['A200'],
    [PALETTE.DEEP_PURPLE]: configPalette[PALETTE.DEEP_PURPLE]['A200'],
    [PALETTE.INDIGO]: configPalette[PALETTE.INDIGO]['A200'],
    [PALETTE.BLUE]: configPalette[PALETTE.BLUE]['A200'],
    [PALETTE.LIGHT_BLUE]: configPalette[PALETTE.LIGHT_BLUE]['A200'],
    [PALETTE.CYAN]: configPalette[PALETTE.CYAN]['A200'],
    [PALETTE.TEAL]: configPalette[PALETTE.TEAL]['A200'],
    [PALETTE.GREEN]: configPalette[PALETTE.GREEN]['A200'],
    [PALETTE.LIGHT_GREEN]: configPalette[PALETTE.LIGHT_GREEN]['A200'],
    [PALETTE.LIME]: configPalette[PALETTE.LIME]['A200'],
    [PALETTE.YELLOW]: configPalette[PALETTE.YELLOW]['A200'],
    [PALETTE.AMBER]: configPalette[PALETTE.AMBER]['A200'],
    [PALETTE.ORANGE]: configPalette[PALETTE.ORANGE]['A200'],
    [PALETTE.DEEP_ORANGE]: configPalette[PALETTE.DEEP_ORANGE]['A200'],
    [PALETTE.BROWN]: configPalette[PALETTE.BROWN]['A200'],
    [PALETTE.GRAY]: configPalette[PALETTE.GRAY]['A200'],
    [PALETTE.BLUE_GRAY]: configPalette[PALETTE.BLUE_GRAY]['A200'],
  },
};

export const DEPTH = {
  '00': '00',
  '01': '01',
  '02': '02',
  '03': '03',
  '04': '04',
  '06': '06',
  '08': '08',
  '12': '12',
  '16': '16',
  '24': '24',
} as const;

export const DEPTH_OPACITY: Record<Depth, Opacity> = {
  [DEPTH['00']]: 0,
  [DEPTH['01']]: 5,
  [DEPTH['02']]: 7,
  [DEPTH['03']]: 8,
  [DEPTH['04']]: 9,
  [DEPTH['06']]: 11,
  [DEPTH['08']]: 12,
  [DEPTH['12']]: 14,
  [DEPTH['16']]: 15,
  [DEPTH['24']]: 16,
} as const;

export const LEVEL = {
  HIGH: 'high',
  MEDIUM: 'medium',
  DISABLED: 'disabled',
} as const;

export const LEVEL_OPACITY: Record<Level, Opacity> = {
  [LEVEL.HIGH]: 87,
  [LEVEL.MEDIUM]: 60,
  [LEVEL.DISABLED]: 38,
} as const;
