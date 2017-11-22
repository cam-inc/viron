import exporter from './exporter';

export default exporter('modals', {
  /**
   * 全てのモーダル情報を返します。
   * @param {Object} state
   * @return {Array}
   */
  all: state => {
    return state.modals;
  }
});
