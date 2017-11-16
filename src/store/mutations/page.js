import exporter from './exporter';

export default exporter('page', {
  /**
   * ページ情報を書き換えます。
   * @param {Object} state
   * @param {Object|null} page
   * @return {Array}
   */
  all: (state, page) => {
    state.page = page;
    return ['page'];
  }
});
