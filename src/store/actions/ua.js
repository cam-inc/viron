import SUA from 'sua.js';
import { constants as mutations } from '../mutations';

export default {
  /**
   * 初期設定を行います。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  setup: context => {
    return Promise
      .resolve()
      .then(() => {
        const ua = new SUA(navigator.userAgent);
        context.commit(mutations.UA, ua);
      });
  }
};
