import path from 'path';
import { RequestHandler } from 'express';
import i18next from 'i18next';
import backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

export const middlewareI18n = (): RequestHandler => {
  i18next
    .use(backend)
    .use(middleware.LanguageDetector)
    .init({
      debug: true,
      fallbackLng: 'en',
      ns: ['viron'],
      defaultNS: 'viron',
      backend: {
        loadPath: path.resolve(
          __dirname,
          '..',
          'locales',
          '{{lng}}',
          '{{ns}}.json'
        ),
      },
    });

  return middleware.handle(i18next);
};
