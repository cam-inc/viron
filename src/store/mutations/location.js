import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('location', {
  /**
   * ページ情報を更新します。
   * @param {Object} state
   * @param {Object} obj
   * @return {Array}
   */
  all: (state, obj) => {
    state.location = ObjectAssign({}, state.location, obj);
    return ['location'];
  },

  /**
   * ページ名を更新します。
   * @param {Object} state
   * @param {String} name
   * @return {Array}
   */
  name: (state, name) => {
    state.location.name = name;
    return ['location'];
  },

  /**
   * ルーティング情報を更新します。
   * @param {Object} state
   * @param {Object} route
   * @return {Array}
   */
  route: (state, route) => {
    state.location.route = route;
    return ['location'];
  }
});
