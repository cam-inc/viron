import riotI18nlet from 'riot-i18nlet';
import ja from './ja';
import en from './en';
import ko from './ko';
const data = {
  ja,
  ko,
  en
};

export default {
  init: () => {
    return Promise.resolve().then(() => {
      let lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
      if (!lang || !data[lang]) {
        lang = 'ja';
      }
      return lang;
    }).then(lang => {
      riotI18nlet.init({
        getMessageFunctionName: 'i18n'
      });
      riotI18nlet.changeLangage(lang);
      riotI18nlet.loads(data);
    });
  },

  get: ( str ,opt = {} ) => {
    return riotI18nlet.i18n(str,opt);
  }

};
