import exporter from './exporter';

export default exporter('popovers', {
  /**
   * 全ての吹き出し情報を返します。
   * @param {Object} state
   * @return {Array}
   */
  all: state => {
    return state.popovers;
  }
});
