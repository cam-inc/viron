import reject from 'mout/array/reject';

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
    return ['modals'];
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalID
   * @return {Array}
   */
  remove: (context, modalID) => {
    context.state.modals = reject(context.state.modals, modal => {
      return (modal.id === modalID);
    });
    return ['modals'];
  }
};
