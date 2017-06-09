import ObjectAssign from 'object-assign';
import { constants as states } from '../states';

export default {
  /**
   * ページ情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Array}
   */
  all: (context, obj) => {
    context.state.page = ObjectAssign({}, context.state.page, obj);
    return [states.PAGE];
  },

  /**
   * ページ名を更新します。
   * @param {riotx.Context} context
   * @param {String} name
   * @return {Array}
   */
  name: (context, name) => {
    context.state.page.name = name;
    return [states.PAGE];
  },

  /**
   * ルーティング情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} route
   * @return {Array}
   */
  route: (context, route) => {
    context.state.page.route = route;
    return [states.PAGE];
  }
};
