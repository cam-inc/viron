import exporter from './exporter';

export default exporter('location', {
  /**
   * 全情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    return state.location;
  },

  /**
   * トップページか判定します。
   * @param {Object} state
   * @return {Object}
   */
  isTop: state => {
    return (state.location.name === 'endpoints');
  },

  /**
   * ページ名を返します。
   * @param {Object} state
   * @return {String}
   */
  name: state => {
    return state.location.name;
  },

  /**
   * ルーティング情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  route: state => {
    return state.location.route;
  }
});
