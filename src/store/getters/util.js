import exporter from './exporter';

export default exporter('util', {
  /**
   * コンポーネント全体リロード値を返します。
   * @param {Object} state
   * @return {Number}
   */
  components_refresh: state => {
    return state.util.components_refresh;
  }
});
