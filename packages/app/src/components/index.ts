import { CSSProperties } from 'react';
import { ClassName } from '@/types/index';

// Common props used for all components.
export type Props = {
  style?: CSSProperties;
  className?: ClassName;
  children?: React.ReactNode;
};
