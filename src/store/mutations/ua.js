import exporter from './exporter';

export default exporter('ua', {
  /**
   * UA情報を書き換えます。
   * @param {Object} state
   * @param {Object} ua
   * @return {Array}
   */
  all: (state, ua) => {
    state.ua = ua;
    return ['ua'];
  }
});
