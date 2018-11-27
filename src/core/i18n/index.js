import riotI18nlet from 'riot-i18nlet';
import ja from './ja';
import en from './en';
const data = {
  ja,
  en
};

export default {
  init: () => {
    return Promise.resolve().then(() => {
      // TODO: 言語設定取得
      return 'ja';
    }).then(lang => {
      riotI18nlet.init({
        getMessageFunctionName: 'i18n'
      });
      riotI18nlet.changeLangage(lang);
      riotI18nlet.loads(data);
    });
  },

  get: str => {
    return riotI18nlet.i18n(str);
  }
};
