import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  initReactI18next,
  useTranslation as useTranslationI18n,
} from 'react-i18next';
import { isDevelopment } from '~/utils';
import { resources } from './resources';

export const defaultNS = 'common';
export { resources };

i18n
  // @see: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18next instance to react-i18next.
  .use(initReactI18next)
  // @see: https://www.i18next.com/overview/configuration-options
  .init({
    debug: isDevelopment,
    fallbackLng: 'en',
    // Refer to README.md for more detail.
    ns: ['common'],
    defaultNS,
    resources,
    // @see: https://react.i18next.com/latest/i18next-instance
    react: {
      useSuspense: false,
    },
  });

export default i18n;

export const useTranslation = useTranslationI18n;
