import SUA from 'sua.js';
import exporter from './exporter';

export default exporter('ua', {
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
        context.commit('ua.all', ua);
      });
  }
});
