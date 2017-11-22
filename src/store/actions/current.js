import exporter from './exporter';

export default exporter('current', {
  /**
   * 選択中endpointKeyを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  update: (context, endpointKey) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('current.all', endpointKey);
      });
  },

  /**
   * 選択中endpointKeyを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('current.all', null);
      });
  }
});
