import exporter from './exporter';

export default exporter('util', {
  /**
   * コンポーネント全体リフレッシュ値を更新します。
   * @param {Object} state
   * @return {Array}
   */
  components_refresh: state => {
    state.util.components_refresh = state.util.components_refresh + 1;
    return ['util'];
  }
});
