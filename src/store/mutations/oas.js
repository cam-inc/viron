import exporter from './exporter';

export default exporter('oas', {
  /**
   * SwaggerClientインスタンスを設定します。
   * @param {Object} state
   * @param {SwaggerClient} client
   * @return {Array}
   */
  client: (state, client) => {
    state.oas.client = client;
    return ['oas'];
  },

  /**
   * SwaggerClientインスタンスをクリアします。
   * @param {Object} state
   * @return {Array}
   */
  clearClient: state => {
    state.oas.client = null;
    return ['oas'];
  }
});
