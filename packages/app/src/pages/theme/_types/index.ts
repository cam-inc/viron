import {
  DEPTH,
  DEPTH_OPACITY,
  LEVEL,
  LEVEL_OPACITY,
  MODE,
  PALETTE,
} from '../_constants/index';

export type HEX = string;

export type Mode = typeof MODE[keyof typeof MODE];

export type Palette = typeof PALETTE[keyof typeof PALETTE];

export type Opacity = number;

export type Level = typeof LEVEL[keyof typeof LEVEL];

export type LevelOpacity = typeof LEVEL_OPACITY[keyof typeof LEVEL_OPACITY];

export type Depth = typeof DEPTH[keyof typeof DEPTH];

export type DepthOpacity = typeof DEPTH_OPACITY[keyof typeof DEPTH_OPACITY];
