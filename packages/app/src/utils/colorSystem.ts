import { normal as normalBlend } from 'color-blend';
import { CSSProperties } from 'react';
import { BaseError } from '~/errors';
import { RGB, Hue, HSL } from '~/types';
import { Theme, THEME } from '~/types/oas';

export const THEME_HUE: Record<Theme, Hue> = {
  [THEME.RED]: 0,
  [THEME.ULTIMATE_ORANGE]: 15,
  [THEME.ORANGE_JUICE]: 30,
  [THEME.AMBER]: 45,
  [THEME.YELLOW]: 60,
  [THEME.LIMONCELLO]: 75,
  [THEME.RADIUMM]: 90,
  [THEME.HARLEQUIN]: 105,
  [THEME.GREEN]: 120,
  [THEME.LUCENT_LIME]: 135,
  [THEME.GUPPIE_GREEN]: 150,
  [THEME.MINTY_PARADISE]: 165,
  [THEME.AQUA]: 180,
  [THEME.CAPRI]: 195,
  [THEME.BRESCIAN_BLUE]: 210,
  [THEME.RARE_BLUE]: 225,
  [THEME.BLUE]: 240,
  [THEME.ELECTRIC_ULTRAMARINE]: 255,
  [THEME.VIOLENT_VIOLET]: 270,
  [THEME.ELECTRIC_PURPLE]: 285,
  [THEME.MAGENDA]: 300,
  [THEME.BRUTAL_PINK]: 315,
  [THEME.NEON_ROSE]: 330,
  [THEME.ELECTRIC_CRIMSON]: 345,
} as const;
export type ThemeHue = typeof THEME_HUE[keyof typeof THEME_HUE];

export type PrimaryKeyColor = HSL;
export type SecondaryKeyColor = HSL;
export type TertiaryKeyColor = HSL;
export type AccentColors = {
  primary: PrimaryKeyColor;
  secondary: SecondaryKeyColor;
  tertiary: TertiaryKeyColor;
};
export type NeutralKeyColor = HSL;
export type NeutralVariantKeyColor = HSL;
export type NeutralColors = {
  base: NeutralKeyColor;
  variant: NeutralVariantKeyColor;
};
export type KeyColors = {
  accent: AccentColors;
  neutral: NeutralColors;
};

export type BaseErrorColor = HSL;
export type ErrorColors = {
  base: BaseErrorColor;
};
export type CustomColors = Record<string, HSL>;

export type AdditionalColors = {
  error: ErrorColors;
  custom: CustomColors;
};

export type Tone = {
  hsl: HSL;
  level: ToneLevel;
};
export const TONE_LEVEL = {
  '0': 0,
  '5': 5,
  '10': 10,
  '15': 15,
  '20': 20,
  '25': 25,
  '30': 30,
  '40': 40,
  '50': 50,
  '60': 60,
  '70': 70,
  '75': 75,
  '80': 80,
  '85': 85,
  '90': 90,
  '95': 95,
  '100': 100,
} as const;
export type ToneLevel = typeof TONE_LEVEL[keyof typeof TONE_LEVEL];

export const MODE_NAME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
export type ModeName = typeof MODE_NAME[keyof typeof MODE_NAME];
export const ROLE = {
  PRIMARY: 'primary',
  ON_PRIMARY: 'onPrimary',
  ON_PRIMARY_HIGH: 'onPrimaryHigh',
  ON_PRIMARY_LOW: 'onPrimaryLow',
  ON_PRIMARY_SLIGHT: 'onPrimarySlight',
  ON_PRIMARY_FAINT: 'onPrimaryFaint',
  PRIMARY_CONTAINER: 'primaryContainer',
  ON_PRIMARY_CONTAINER: 'onPrimaryContainer',
  ON_PRIMARY_CONTAINER_HIGH: 'onPrimaryContainerHigh',
  ON_PRIMARY_CONTAINER_LOW: 'onPrimaryContainerLow',
  ON_PRIMARY_CONTAINER_SLIGHT: 'onPrimaryContainerSlight',
  ON_PRIMARY_CONTAINER_FAINT: 'onPrimaryContainerFaint',
  SECONDARY: 'secondary',
  ON_SECONDARY: 'onSecondary',
  ON_SECONDARY_HIGH: 'onSecondaryHigh',
  ON_SECONDARY_LOW: 'onSecondaryLow',
  ON_SECONDARY_SLIGHT: 'onSecondarySlight',
  ON_SECONDARY_FAINT: 'onSecondaryFaint',
  SECONDARY_CONTAINER: 'secondaryContainer',
  ON_SECONDARY_CONTAINER: 'onSecondaryContainer',
  ON_SECONDARY_CONTAINER_HIGH: 'onSecondaryContainerHigh',
  ON_SECONDARY_CONTAINER_LOW: 'onSecondaryContainerLow',
  ON_SECONDARY_CONTAINER_SLIGHT: 'onSecondaryContainerSlight',
  ON_SECONDARY_CONTAINER_FAINT: 'onSecondaryContainerFaint',
  TERTIARY: 'tertiary',
  ON_TERTIARY: 'onTertiary',
  ON_TERTIARY_HIGH: 'onTertiaryHigh',
  ON_TERTIARY_LOW: 'onTertiaryLow',
  ON_TERTIARY_SLIGHT: 'onTertiarySlight',
  ON_TERTIARY_FAINT: 'onTertiaryFaint',
  TERTIARY_CONTAINER: 'tertiaryContainer',
  ON_TERTIARY_CONTAINER: 'onTertiaryContainer',
  ON_TERTIARY_CONTAINER_HIGH: 'onTertiaryContainerHigh',
  ON_TERTIARY_CONTAINER_LOW: 'onTertiaryContainerLow',
  ON_TERTIARY_CONTAINER_SLIGHT: 'onTertiaryContainerSlight',
  ON_TERTIARY_CONTAINER_FAINT: 'onTertiaryContainerFaint',
  ERROR: 'error',
  ON_ERROR: 'onError',
  ON_ERROR_HIGH: 'onErrorHigh',
  ON_ERROR_LOW: 'onErrorLow',
  ON_ERROR_SLIGHT: 'onErrorSlight',
  ON_ERROR_FAINT: 'onErrorFaint',
  ERROR_CONTAINER: 'errorContainer',
  ON_ERROR_CONTAINER: 'onErrorContainer',
  ON_ERROR_CONTAINER_HIGH: 'onErrorContainerHigh',
  ON_ERROR_CONTAINER_LOW: 'onErrorContainerLow',
  ON_ERROR_CONTAINER_SLIGHT: 'onErrorContainerSlight',
  ON_ERROR_CONTAINER_FAINT: 'onErrorContainerFaint',
  BACKGROUND: 'background',
  ON_BACKGROUND: 'onBackground',
  ON_BACKGROUND_HIGH: 'onBackgroundHigh',
  ON_BACKGROUND_LOW: 'onBackgroundLow',
  ON_BACKGROUND_SLIGHT: 'onBackgroundSlight',
  ON_BACKGROUND_FAINT: 'onBackgroundFaint',
  SURFACE: 'surface',
  ON_SURFACE: 'onSurface',
  ON_SURFACE_HIGH: 'onSurfaceHigh',
  ON_SURFACE_LOW: 'onSurfaceLow',
  ON_SURFACE_SLIGHT: 'onSurfaceSlight',
  ON_SURFACE_FAINT: 'onSurfaceFaint',
  SURFACE_VARIANT: 'surfaceVariant',
  ON_SURFACE_VARIANT: 'onSurfaceVariant',
  ON_SURFACE_VARIANT_HIGH: 'onSurfaceVariantHigh',
  ON_SURFACE_VARIANT_LOW: 'onSurfaceVariantLow',
  ON_SURFACE_VARIANT_SLIGHT: 'onSurfaceVariantSlight',
  ON_SURFACE_VARIANT_FAINT: 'onSurfaceVariantFaint',
  OUTLINE: 'outline',
} as const;
export type Role = typeof ROLE[keyof typeof ROLE];
export type Mode = Record<Role, HSL>;

export type Tokens = {
  tonalPalettes: {
    keyColors: {
      accent: {
        primary: Tone[];
        secondary: Tone[];
        tertiary: Tone[];
      };
      neutral: {
        base: Tone[];
        variant: Tone[];
      };
    };
    additionalColors: {
      error: {
        base: Tone[];
      };
      custom: Record<string, Tone[]>;
    };
  };
  modes: Record<ModeName, Mode>;
};

export const getTokens = (theme: Theme): Tokens => {
  const hue = THEME_HUE[theme];
  const keyColors = getKeyColors(hue);
  const additionalColors = getAdditionalColors(hue);
  const LIGHT_TONE: Record<string, ToneLevel> = {
    GROUND: 30,
    ON: 90,
    ON_HIGH: 100,
    ON_LOW: 80,
    ON_SLIGHT: 50,
    ON_FAINT: 40,
    CONTAINER: 20,
    CONTAINER_ON: 80,
    CONTAINER_ON_HIGH: 90,
    CONTAINER_ON_LOW: 70,
    CONTAINER_ON_SLIGHT: 40,
    CONTAINER_ON_FAINT: 30,
    BG: 95,
    BG_ON: 30,
    BG_ON_HIGH: 0,
    BG_ON_LOW: 60,
    BG_ON_SLIGHT: 80,
    BG_ON_FAINT: 90,
    SURFACE: 90,
    SURFACE_ON: 20,
    SURFACE_ON_HIGH: 0,
    SURFACE_ON_LOW: 40,
    SURFACE_ON_SLIGHT: 70,
    SURFACE_ON_FAINT: 85,
    SURFACE_VARIANT: 80,
    SURFACE_VARIANT_ON: 20,
    SURFACE_VARIANT_ON_HIGH: 0,
    SURFACE_VARIANT_ON_LOW: 40,
    SURFACE_VARIANT_ON_SLIGHT: 70,
    SURFACE_VARIANT_ON_FAINT: 75,
  };
  const DARK_TONE: Record<string, ToneLevel> = {
    GROUND: 80,
    ON: 10,
    ON_HIGH: 0,
    ON_LOW: 20,
    ON_SLIGHT: 70,
    ON_FAINT: 75,
    CONTAINER: 30,
    CONTAINER_ON: 90,
    CONTAINER_ON_HIGH: 100,
    CONTAINER_ON_LOW: 80,
    CONTAINER_ON_SLIGHT: 50,
    CONTAINER_ON_FAINT: 40,
    BG: 5,
    BG_ON: 80,
    BG_ON_HIGH: 90,
    BG_ON_LOW: 60,
    BG_ON_SLIGHT: 30,
    BG_ON_FAINT: 15,
    SURFACE: 10,
    SURFACE_ON: 80,
    SURFACE_ON_HIGH: 90,
    SURFACE_ON_LOW: 60,
    SURFACE_ON_SLIGHT: 40,
    SURFACE_ON_FAINT: 20,
    SURFACE_VARIANT: 15,
    SURFACE_VARIANT_ON: 80,
    SURFACE_VARIANT_ON_HIGH: 90,
    SURFACE_VARIANT_ON_LOW: 60,
    SURFACE_VARIANT_ON_SLIGHT: 40,
    SURFACE_VARIANT_ON_FAINT: 25,
  };
  return {
    tonalPalettes: {
      keyColors: {
        accent: {
          primary: getTones(keyColors.accent.primary),
          secondary: getTones(keyColors.accent.secondary),
          tertiary: getTones(keyColors.accent.tertiary),
        },
        neutral: {
          base: getTones(keyColors.neutral.base),
          variant: getTones(keyColors.neutral.variant),
        },
      },
      additionalColors: {
        error: {
          base: getTones(additionalColors.error.base),
        },
        custom: {},
      },
    },
    modes: {
      [MODE_NAME.LIGHT]: {
        primary: pickTone(getTones(keyColors.accent.primary), LIGHT_TONE.GROUND)
          .hsl,
        onPrimary: pickTone(getTones(keyColors.accent.primary), LIGHT_TONE.ON)
          .hsl,
        onPrimaryHigh: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.ON_HIGH
        ).hsl,
        onPrimaryLow: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.ON_LOW
        ).hsl,
        onPrimarySlight: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.ON_SLIGHT
        ).hsl,
        onPrimaryFaint: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.ON_FAINT
        ).hsl,
        primaryContainer: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER
        ).hsl,
        onPrimaryContainer: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER_ON
        ).hsl,
        onPrimaryContainerHigh: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onPrimaryContainerLow: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER_ON_LOW
        ).hsl,
        onPrimaryContainerSlight: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onPrimaryContainerFaint: pickTone(
          getTones(keyColors.accent.primary),
          LIGHT_TONE.CONTAINER_ON_FAINT
        ).hsl,
        secondary: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.GROUND
        ).hsl,
        onSecondary: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.ON
        ).hsl,
        onSecondaryHigh: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.ON_HIGH
        ).hsl,
        onSecondaryLow: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.ON_LOW
        ).hsl,
        onSecondarySlight: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.ON_SLIGHT
        ).hsl,
        onSecondaryFaint: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.ON_FAINT
        ).hsl,
        secondaryContainer: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER
        ).hsl,
        onSecondaryContainer: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER_ON
        ).hsl,
        onSecondaryContainerHigh: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onSecondaryContainerLow: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER_ON_LOW
        ).hsl,
        onSecondaryContainerSlight: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onSecondaryContainerFaint: pickTone(
          getTones(keyColors.accent.secondary),
          LIGHT_TONE.CONTAINER_ON_FAINT
        ).hsl,
        tertiary: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.GROUND
        ).hsl,
        onTertiary: pickTone(getTones(keyColors.accent.tertiary), LIGHT_TONE.ON)
          .hsl,
        onTertiaryHigh: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.ON_HIGH
        ).hsl,
        onTertiaryLow: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.ON_LOW
        ).hsl,
        onTertiarySlight: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.ON_SLIGHT
        ).hsl,
        onTertiaryFaint: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.ON_FAINT
        ).hsl,
        tertiaryContainer: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER
        ).hsl,
        onTertiaryContainer: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER_ON
        ).hsl,
        onTertiaryContainerHigh: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onTertiaryContainerLow: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER_ON_LOW
        ).hsl,
        onTertiaryContainerSlight: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onTertiaryContainerFaint: pickTone(
          getTones(keyColors.accent.tertiary),
          LIGHT_TONE.CONTAINER_ON_FAINT
        ).hsl,
        error: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.GROUND
        ).hsl,
        onError: pickTone(getTones(additionalColors.error.base), LIGHT_TONE.ON)
          .hsl,
        onErrorHigh: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.ON_HIGH
        ).hsl,
        onErrorLow: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.ON_LOW
        ).hsl,
        onErrorSlight: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.ON_SLIGHT
        ).hsl,
        onErrorFaint: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.ON_FAINT
        ).hsl,
        errorContainer: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER
        ).hsl,
        onErrorContainer: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER_ON
        ).hsl,
        onErrorContainerHigh: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onErrorContainerLow: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER_ON_LOW
        ).hsl,
        onErrorContainerSlight: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onErrorContainerFaint: pickTone(
          getTones(additionalColors.error.base),
          LIGHT_TONE.CONTAINER_ON_FAINT
        ).hsl,
        background: pickTone(getTones(keyColors.neutral.base), LIGHT_TONE.BG)
          .hsl,
        onBackground: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.BG_ON
        ).hsl,
        onBackgroundHigh: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.BG_ON_HIGH
        ).hsl,
        onBackgroundLow: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.BG_ON_LOW
        ).hsl,
        onBackgroundSlight: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.BG_ON_SLIGHT
        ).hsl,
        onBackgroundFaint: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.BG_ON_FAINT
        ).hsl,
        surface: pickTone(getTones(keyColors.neutral.base), LIGHT_TONE.SURFACE)
          .hsl,
        onSurface: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.SURFACE_ON
        ).hsl,
        onSurfaceHigh: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.SURFACE_ON_HIGH
        ).hsl,
        onSurfaceLow: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.SURFACE_ON_LOW
        ).hsl,
        onSurfaceSlight: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.SURFACE_ON_SLIGHT
        ).hsl,
        onSurfaceFaint: pickTone(
          getTones(keyColors.neutral.base),
          LIGHT_TONE.SURFACE_ON_FAINT
        ).hsl,
        surfaceVariant: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT
        ).hsl,
        onSurfaceVariant: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT_ON
        ).hsl,
        onSurfaceVariantHigh: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT_ON_HIGH
        ).hsl,
        onSurfaceVariantLow: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT_ON_LOW
        ).hsl,
        onSurfaceVariantSlight: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT_ON_SLIGHT
        ).hsl,
        onSurfaceVariantFaint: pickTone(
          getTones(keyColors.neutral.variant),
          LIGHT_TONE.SURFACE_VARIANT_ON_FAINT
        ).hsl,
        outline: pickTone(getTones(keyColors.neutral.variant), 50).hsl,
      },
      [MODE_NAME.DARK]: {
        primary: pickTone(getTones(keyColors.accent.primary), DARK_TONE.GROUND)
          .hsl,
        onPrimary: pickTone(getTones(keyColors.accent.primary), DARK_TONE.ON)
          .hsl,
        onPrimaryHigh: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.ON_HIGH
        ).hsl,
        onPrimaryLow: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.ON_LOW
        ).hsl,
        onPrimarySlight: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.ON_SLIGHT
        ).hsl,
        onPrimaryFaint: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.ON_FAINT
        ).hsl,
        primaryContainer: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER
        ).hsl,
        onPrimaryContainer: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER_ON
        ).hsl,
        onPrimaryContainerHigh: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onPrimaryContainerLow: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER_ON_LOW
        ).hsl,
        onPrimaryContainerSlight: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onPrimaryContainerFaint: pickTone(
          getTones(keyColors.accent.primary),
          DARK_TONE.CONTAINER_ON_FAINT
        ).hsl,
        secondary: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.GROUND
        ).hsl,
        onSecondary: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.ON
        ).hsl,
        onSecondaryHigh: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.ON_HIGH
        ).hsl,
        onSecondaryLow: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.ON_LOW
        ).hsl,
        onSecondarySlight: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.ON_SLIGHT
        ).hsl,
        onSecondaryFaint: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.ON_FAINT
        ).hsl,
        secondaryContainer: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER
        ).hsl,
        onSecondaryContainer: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER_ON
        ).hsl,
        onSecondaryContainerHigh: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onSecondaryContainerLow: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER_ON_LOW
        ).hsl,
        onSecondaryContainerSlight: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onSecondaryContainerFaint: pickTone(
          getTones(keyColors.accent.secondary),
          DARK_TONE.CONTAINER_ON_FAINT
        ).hsl,
        tertiary: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.GROUND
        ).hsl,
        onTertiary: pickTone(getTones(keyColors.accent.tertiary), DARK_TONE.ON)
          .hsl,
        onTertiaryHigh: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.ON_HIGH
        ).hsl,
        onTertiaryLow: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.ON_LOW
        ).hsl,
        onTertiarySlight: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.ON_SLIGHT
        ).hsl,
        onTertiaryFaint: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.ON_FAINT
        ).hsl,
        tertiaryContainer: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER
        ).hsl,
        onTertiaryContainer: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER_ON
        ).hsl,
        onTertiaryContainerHigh: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onTertiaryContainerLow: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER_ON_LOW
        ).hsl,
        onTertiaryContainerSlight: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onTertiaryContainerFaint: pickTone(
          getTones(keyColors.accent.tertiary),
          DARK_TONE.CONTAINER_ON_FAINT
        ).hsl,
        error: pickTone(getTones(additionalColors.error.base), DARK_TONE.GROUND)
          .hsl,
        onError: pickTone(getTones(additionalColors.error.base), DARK_TONE.ON)
          .hsl,
        onErrorHigh: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.ON_HIGH
        ).hsl,
        onErrorLow: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.ON_LOW
        ).hsl,
        onErrorSlight: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.ON_SLIGHT
        ).hsl,
        onErrorFaint: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.ON_FAINT
        ).hsl,
        errorContainer: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER
        ).hsl,
        onErrorContainer: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER_ON
        ).hsl,
        onErrorContainerHigh: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER_ON_HIGH
        ).hsl,
        onErrorContainerLow: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER_ON_LOW
        ).hsl,
        onErrorContainerSlight: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER_ON_SLIGHT
        ).hsl,
        onErrorContainerFaint: pickTone(
          getTones(additionalColors.error.base),
          DARK_TONE.CONTAINER_ON_FAINT
        ).hsl,
        background: pickTone(getTones(keyColors.neutral.base), DARK_TONE.BG)
          .hsl,
        onBackground: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.BG_ON
        ).hsl,
        onBackgroundHigh: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.BG_ON_HIGH
        ).hsl,
        onBackgroundLow: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.BG_ON_LOW
        ).hsl,
        onBackgroundSlight: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.BG_ON_SLIGHT
        ).hsl,
        onBackgroundFaint: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.BG_ON_FAINT
        ).hsl,
        surface: pickTone(getTones(keyColors.neutral.base), DARK_TONE.SURFACE)
          .hsl,
        onSurface: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.SURFACE_ON
        ).hsl,
        onSurfaceHigh: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.SURFACE_ON_HIGH
        ).hsl,
        onSurfaceLow: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.SURFACE_ON_LOW
        ).hsl,
        onSurfaceSlight: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.SURFACE_ON_SLIGHT
        ).hsl,
        onSurfaceFaint: pickTone(
          getTones(keyColors.neutral.base),
          DARK_TONE.SURFACE_ON_FAINT
        ).hsl,
        surfaceVariant: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT
        ).hsl,
        onSurfaceVariant: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT_ON
        ).hsl,
        onSurfaceVariantHigh: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT_ON_HIGH
        ).hsl,
        onSurfaceVariantLow: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT_ON_LOW
        ).hsl,
        onSurfaceVariantSlight: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT_ON_SLIGHT
        ).hsl,
        onSurfaceVariantFaint: pickTone(
          getTones(keyColors.neutral.variant),
          DARK_TONE.SURFACE_VARIANT_ON_FAINT
        ).hsl,
        outline: pickTone(getTones(keyColors.neutral.variant), 60).hsl,
      },
    },
  };
};

export const getCustomProperties = (theme: Theme): CSSProperties => {
  const tokens = getTokens(theme);
  const ret: Record<string, string> = {};
  Object.values(MODE_NAME).forEach((modeName) => {
    const mode = tokens.modes[modeName];
    Object.values(ROLE).forEach((role) => {
      const { h, s, l } = mode[role];
      const _role = role.replace(/[A-Z]/g, (str) => `-${str.toLowerCase()}`);
      ret[`--thm-${modeName}-${_role}`] = `hsl(${h}, ${s}%, ${l}%)`;
    });
  });
  return ret as CSSProperties;
};

// @see: https://m3.material.io/styles/color/the-color-system/key-colors-tones#5fdf196d-1e21-4d03-ae63-e802d61ad5ee
export const getKeyColors = (hue: Hue): KeyColors => {
  const accentColors: AccentColors = {
    primary: { h: hue, s: 100, l: 50 },
    secondary: { h: hue, s: 50, l: 50 },
    tertiary: { h: hue + 180, s: 100, l: 50 },
  };
  const neutralColors: NeutralColors = {
    base: { h: hue, s: 15, l: 50 },
    variant: { h: hue, s: 5, l: 50 },
  };
  const keyColors: KeyColors = {
    accent: accentColors,
    neutral: neutralColors,
  };
  return keyColors;
};

export const getAdditionalColors = (hue: Hue): AdditionalColors => {
  const errorColors: ErrorColors = {
    base: rgbToHsl(
      normalBlend(
        {
          ...hslToRgb({ h: 0, s: 100, l: 50 }),
          a: 1,
        },
        {
          ...hslToRgb({ h: hue, s: 100, l: 50 }),
          a: 0.2,
        }
      )
    ),
  };
  const customColors: CustomColors = {};
  const additionalColors = {
    error: errorColors,
    custom: customColors,
  };
  return additionalColors;
};

// 13 tones of a color specified with white and black included.
// @see: https://m3.material.io/styles/color/the-color-system/key-colors-tones#a828e350-1551-45e5-8430-eb643e6a7713
export const getTones = (hsl: HSL): Tone[] => {
  return Object.values(TONE_LEVEL)
    .sort((a, b) => a - b)
    .map((toneLevel) => {
      if (toneLevel === 0) {
        return {
          hsl: {
            ...hsl,
            l: 0,
          },
          level: toneLevel,
        };
      }
      if (toneLevel === 50) {
        return {
          hsl,
          level: toneLevel,
        };
      }
      if (toneLevel === 100) {
        return {
          hsl: {
            ...hsl,
            l: 100,
          },
          level: toneLevel,
        };
      }
      if (toneLevel < 50) {
        return {
          hsl: rgbToHsl(
            normalBlend(
              {
                ...hslToRgb(hsl),
                a: 1,
              },
              {
                r: 0,
                g: 0,
                b: 0,
                a: ((50 - toneLevel) * 2) / 100,
              }
            )
          ),
          level: toneLevel,
        };
      } else {
        return {
          hsl: rgbToHsl(
            normalBlend(
              {
                ...hslToRgb(hsl),
                a: 1,
              },
              {
                r: 255,
                g: 255,
                b: 255,
                a: ((toneLevel - 50) * 2) / 100,
              }
            )
          ),
          level: toneLevel,
        };
      }
    });
  /*
  return toneLevelList.map(toneLevel => ({
    hsl: {
      h: hsl.h,
      s: hsl.s,
      l: toneLevel,
    },
    level: toneLevel,
  }));
  */
};

export const pickTone = (tones: Tone[], level: Tone['level']): Tone => {
  const tone = tones.find((tone) => tone.level === level);
  if (!tone) {
    throw new BaseError('Tone not found.');
  }
  return tone;
};

// Convert HSL to RGB.
export const hslToRgb = (hsl: HSL): RGB => {
  let { h, s, l } = hsl;
  const RGB_MAX = 255;
  const HUE_MAX = 360;
  const SATURATION_MAX = 100;
  const LIGHTNESS_MAX = 100;
  let r, g, b, max, min;

  h = h % HUE_MAX;
  s = s / SATURATION_MAX;
  l = l / LIGHTNESS_MAX;

  if (l < 0.5) {
    max = l + l * s;
    min = l - l * s;
  } else {
    max = l + (1 - l) * s;
    min = l - (1 - l) * s;
  }

  const hp = HUE_MAX / 6;
  const q = h / hp;
  if (q <= 1) {
    r = max;
    g = (h / hp) * (max - min) + min;
    b = min;
  } else if (q <= 2) {
    r = ((hp * 2 - h) / hp) * (max - min) + min;
    g = max;
    b = min;
  } else if (q <= 3) {
    r = min;
    g = max;
    b = ((h - hp * 2) / hp) * (max - min) + min;
  } else if (q <= 4) {
    r = min;
    g = ((hp * 4 - h) / hp) * (max - min) + min;
    b = max;
  } else if (q <= 5) {
    r = ((h - hp * 4) / hp) * (max - min) + min;
    g = min;
    b = max;
  } else {
    r = max;
    g = min;
    b = ((HUE_MAX - h) / hp) * (max - min) + min;
  }

  return {
    r: r * RGB_MAX,
    g: g * RGB_MAX,
    b: b * RGB_MAX,
  };
};

// Convert RGB to HSL.
export const rgbToHsl = (rgb: RGB): HSL => {
  const { r, g, b } = rgb;
  const RGB_MAX = 255;
  const HUE_MAX = 360;
  const SATURATION_MAX = 100;
  const LIGHTNESS_MAX = 100;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;

  // Hue
  const hp = HUE_MAX / 6;
  if (max == min) {
    h = 0;
  } else if (r == max) {
    h = hp * ((g - b) / (max - min));
  } else if (g == max) {
    h = hp * ((b - r) / (max - min)) + HUE_MAX / 3;
  } else {
    h = hp * ((r - g) / (max - min)) + (HUE_MAX * 2) / 3;
  }
  if (h < 0) {
    h += HUE_MAX;
  }

  // Saturation
  const cnt = (max + min) / 2;
  if (cnt < RGB_MAX / 2) {
    if (max + min <= 0) {
      s = 0;
    } else {
      s = ((max - min) / (max + min)) * SATURATION_MAX;
    }
  } else {
    s = ((max - min) / (RGB_MAX * 2 - max - min)) * SATURATION_MAX;
  }

  // Lightness
  const l = ((max + min) / RGB_MAX / 2) * LIGHTNESS_MAX;

  return {
    h: h,
    s: s,
    l: l,
  };
};
