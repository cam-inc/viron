import { Color, Theme } from '../../constants';
import { Pages } from './page';

export interface Viron {
  color: Color;
  theme: Theme;
  name: string;
  pages: Pages;
  thumbnail: string;
  tags: string[];
}

export const genViron = (
  color: Color,
  theme: Theme,
  name: string,
  pages: Pages,
  thumbnail: string,
  tags: string[]
): Viron => {
  return {
    color,
    theme,
    name,
    pages,
    thumbnail,
    tags,
  };
};

export * from './component';
export * from './page';
export * from './authtype';
