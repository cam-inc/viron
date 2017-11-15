import ObjectAssign from 'object-assign';

export default {
  /**
   * ページ情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Array}
   */
  all: (context, obj) => {
    context.state.location = ObjectAssign({}, context.state.location, obj);
    return ['location'];
  },

  /**
   * ページ名を更新します。
   * @param {riotx.Context} context
   * @param {String} name
   * @return {Array}
   */
  name: (context, name) => {
    context.state.location.name = name;
    return ['location'];
  },

  /**
   * ルーティング情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} route
   * @return {Array}
   */
  route: (context, route) => {
    context.state.location.route = route;
    return ['location'];
  }
};
