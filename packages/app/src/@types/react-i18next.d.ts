/**
 * @see https://www.i18next.com/overview/typescript
 */
import { resources, defaultNS } from '~/i18n';

type A = typeof resources['en'];

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}
