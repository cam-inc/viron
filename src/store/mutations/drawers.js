import reject from 'mout/array/reject';
import { constants as states } from '../states';

export default {
  /**
   * ドローワーを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} drawerOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts = {}, drawerOpts = {}) => {
    context.state.drawers.push({
      id: `drawer_${Date.now()}`,
      tagName,
      tagOpts,
      drawerOpts
    });
    return [states.DRAWERS];
  },

  /**
   * ドローワーを削除します。
   * @param {riotx.Context} context
   * @param {String} drawerID
   * @return {Array}
   */
  remove: (context, drawerID) => {
    context.state.drawers = reject(context.state.drawers, drawer => {
      return (drawer.id === drawerID);
    });
    return [states.DRAWERS];
  }
};
