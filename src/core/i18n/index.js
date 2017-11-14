// i18n対応
// @see: https://www.i18next.com
// API経由で定義ファイルを取得する場合は、
// https://github.com/i18next/i18next-xhr-backend
// 等を使うこと。



import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import ja from './ja';
import en from './en';

export default {
  init: () => {
    return new Promise((resolve, reject) => {
      i18next
        .use(LngDetector)
        .init({
          // @see: https://www.i18next.com/configuration-options.html
          fallbackLng: 'ja',
          resources: {
            ja: { translation: ja },
            en: { translation: en }
          }
        }, err => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
    });
  },

  /**
   * @return {i18next}
   */
  get: () => {
    return i18next;
  }
};

const i18n = i18next;
export {
  i18n
};
