import exporter from './exporter';

export default exporter('drawers', {
  /**
   * ドローワーを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} drawerOpts
   * @param {Object} opts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, drawerOpts, opts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('drawers.add', tagName, tagOpts, drawerOpts, opts);
      });
  },

  /**
   * ドローワーを削除します。
   * @param {riotx.Context} context
   * @param {String} drawerId
   * @return {Promise}
   */
  remove: (context, drawerId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('drawers.remove', drawerId);
      });
  }
});
