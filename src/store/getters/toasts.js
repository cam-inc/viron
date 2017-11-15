import exporter from './exporter';

export default exporter('toasts', {
  /**
   * 全てのトースト情報を返します。
   * @param {Object} state
   * @return {Array}
   */
  all: state => {
    return state.toasts;
  }
});
