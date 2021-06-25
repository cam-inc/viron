import {
  BACKGROUND,
  DEPTH_OPACITY,
  ERROR,
  LEVEL,
  LEVEL_OPACITY,
  MODE,
  OVERLAY,
  PRIMARY,
  PRIMARY_VARIANT,
  SECONDARY,
  SECONDARY_VARIANT,
} from '../_constants/index';
import { Depth, HEX, Level, Mode, Opacity, Palette } from '../_types/index';

export const getBackground = function (mode: Mode): HEX {
  return BACKGROUND[mode];
};

export const getSurface = function (mode: Mode, palette: Palette): HEX {
  const back = getBackground(mode);
  const frontSurface = getPrimary(mode, palette);
  const frontOpacity = 8;
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getSurfaceElevated = function (
  mode: Mode,
  palette: Palette,
  depth: Depth
): HEX {
  const back = getSurface(mode, palette);
  let frontSurface: HEX;
  switch (mode) {
    case MODE.LIGHT:
      frontSurface = getPrimary(mode, palette);
      break;
    case MODE.DARK:
      frontSurface = OVERLAY[mode];
      break;
  }
  const frontOpacity = DEPTH_OPACITY[depth];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getPrimary = function (mode: Mode, palette: Palette): HEX {
  return PRIMARY[mode][palette];
};

export const getPrimaryVariant = function (mode: Mode, palette: Palette): HEX {
  return PRIMARY_VARIANT[mode][palette];
};

export const getSecondary = function (mode: Mode, palette: Palette): HEX {
  return SECONDARY[mode][palette];
};

export const getSecondaryVariant = function (
  mode: Mode,
  palette: Palette
): HEX {
  return SECONDARY_VARIANT[mode][palette];
};

export const getError = function (mode: Mode): HEX {
  switch (mode) {
    case MODE.LIGHT:
      return ERROR;
    case MODE.DARK: {
      const back = ERROR;
      const frontSurface = OVERLAY[mode];
      const frontOpacity = 40;
      return mergeColors(back, frontSurface, frontOpacity);
    }
  }
};

export const getOnBackground = function (mode: Mode, level?: Level): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getBackground(mode);
  const frontSurface = OVERLAY[mode];
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnBackgroundVariant = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getBackground(mode);
  const frontSurface = getPrimary(mode, palette);
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnSurface = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getSurface(mode, palette);
  const frontSurface = OVERLAY[mode];
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnPrimary = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getPrimary(mode, palette);
  const frontSurface = getBackground(mode);
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnPrimaryVariant = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getPrimaryVariant(mode, palette);
  const frontSurface = getBackground(mode);
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnSecondary = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getSecondary(mode, palette);
  const frontSurface = getBackground(mode);
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnSecondaryVariant = function (
  mode: Mode,
  palette: Palette,
  level?: Level
): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getSecondaryVariant(mode, palette);
  const frontSurface = getBackground(mode);
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

export const getOnError = function (mode: Mode, level?: Level): HEX {
  level = level || LEVEL.MEDIUM;
  const back = getError(mode);
  let frontSurface: HEX;
  switch (mode) {
    case MODE.LIGHT:
      frontSurface = getBackground(mode);
      break;
    case MODE.DARK:
      frontSurface = ERROR;
      break;
  }
  const frontOpacity = LEVEL_OPACITY[level];
  return mergeColors(back, frontSurface, frontOpacity);
};

const mergeColors = function (
  back: HEX,
  frontSurface: HEX,
  frontOpacity: Opacity
): HEX {
  const canvasElement = document.createElement('canvas');
  const context = canvasElement.getContext('2d') as CanvasRenderingContext2D;
  context.fillStyle = back;
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = frontSurface;
  context.globalAlpha = frontOpacity / 100;
  context.fillRect(0, 0, 1, 1);
  const imageData = context.getImageData(0, 0, 1, 1);
  return rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);
};

const rgbToHex = function (r: number, g: number, b: number): HEX {
  const f = function (c: number) {
    const hex = c.toString(16);
    if (hex.length === 1) {
      return `0${hex}`;
    } else {
      return hex;
    }
  };
  return `#${f(r)}${f(g)}${f(b)}`;
};
