import exporter from './exporter';

export default exporter('popovers', {
  /**
   * 吹き出しを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} popoverOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, popoverOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('popovers.add', tagName, tagOpts, popoverOpts);
      });
  },

  /**
   * 吹き出しを削除します。
   * @param {riotx.Context} context
   * @param {String} popoverId
   * @return {Promise}
   */
  remove: (context, popoverId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('popovers.remove', popoverId);
      });
  },

  /**
   * 全ての吹き出しを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('popovers.removeAll');
      });
  }
});
