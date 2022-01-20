import { CSSProperties } from 'react';

// Common props for all button components.
export type Props<T = null> = Pick<
  React.ButtonHTMLAttributes<string>,
  'type' | 'disabled'
> & {
  size?: Size;
  data?: T;
  rounded?: boolean;
  pl?: CSSProperties['paddingLeft'];
  onClick: (data: T) => void;
};

export const SIZE = {
  XXS: 'xxs',
  XS: 'xs',
  SM: 'sm',
  BASE: 'base',
  XL: 'xl',
  '2XL': '2xl',
};
export type Size = typeof SIZE[keyof typeof SIZE];
