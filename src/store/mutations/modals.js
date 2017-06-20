import reject from 'mout/array/reject';
import { constants as states } from '../states';

export default {
  /**
   * モーダルを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts = {}, modalOpts = {}) => {
    context.state.modals.push({
      id: `modal_${Date.now()}`,
      tagName,
      tagOpts,
      modalOpts
    });
    return [states.MODALS];
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalID
   * @return {Array}
   */
  remove: (context, modalID) => {
    context.state.modals = reject(context.state.modal, modal => {
      return (modal.id === modalID);
    });
    return [states.MODALS];
  }
};
