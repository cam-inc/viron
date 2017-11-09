import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import { constants as states } from '../states';

export default {
  /**
   * 吹き出しを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} popoverOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts = {}, popoverOpts = {}) => {
    context.state.popovers.push({
      id: `popover_${Date.now()}`,
      tagName,
      tagOpts,
      popoverOpts: ObjectAssign({
        direction: 'T',
        width: 100,
        x: 0,
        y: 0
      }, popoverOpts)
    });
    return [states.POPOVERS];
  },

  /**
   * 吹き出しを削除します。
   * @param {riotx.Context} context
   * @param {String} popoverID
   * @return {Array}
   */
  remove: (context, popoverID) => {
    context.state.popovers = reject(context.state.popovers, popover => {
      return (popover.id === popoverID);
    });
    return [states.POPOVERS];
  }
};
