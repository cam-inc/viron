import exporter from './exporter';

export default exporter('toasts', {
  /**
   * トーストを追加します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Promise}
   */
  add: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('toasts.add', obj);
      });
  },

  /**
   * トーストを削除します。
   * @param {riotx.Context} context
   * @param {String} toastId
   * @return {Promise}
   */
  remove: (context, toastId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('toasts.remove', toastId);
      });
  }

});
