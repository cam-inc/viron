import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import resourceEn from './resources/en';
import resourceJa from './resources/ja';

i18n
  // @see: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18next instance to react-i18next.
  .use(initReactI18next)
  // @see: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    // Refer to README.md for more detail.
    resources: {
      en: {
        translation: resourceEn,
      },
      ja: {
        translation: resourceJa,
      },
    },
    // @see: https://react.i18next.com/latest/i18next-instance
    react: {
      useSuspense: false,
    },
  });

export default i18n;
