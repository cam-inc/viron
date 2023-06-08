import { CSSProperties } from 'react';
import { ClassName, ColorSystem } from '~/types/index';

// Common props used for all components.
export type Props<T extends string = 'on'> = {
  style?: CSSProperties;
  className?: ClassName;
} & {
  [P in T]: ColorSystem;
};
