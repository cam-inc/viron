import exporter from './exporter';

export default exporter('util', {
  /**
   * コンポーネント全体をリロードします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  refreshAllComponents: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('util.components_refresh');
      });
  }
});
