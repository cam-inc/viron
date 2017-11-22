import exporter from './exporter';

export default exporter('drawers', {
  /**
   * 全てのドローワー情報を返します。
   * @param {Object} state
   * @return {Array}
   */
  all: state => {
    return state.drawers;
  }
});
