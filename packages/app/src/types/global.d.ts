import { ReactNode } from 'react';

declare module 'react' {
  type ReactI18NextChildren = ReactNode; // react-i18nがchildrenの型を上書きしていて、reactと干渉している。それを防ぐためのworkaround。
}
