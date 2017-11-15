export default {
  /**
   * SwaggerClientインスタンスを設定します。
   * @param {riotx.Context} context
   * @param {SwaggerClient} client
   * @return {Array}
   */
  client: (context, client) => {
    context.state.oas.client = client;
    return ['oas'];
  },

  /**
   * SwaggerClientインスタンスをクリアします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  clearClient: context => {
    context.state.oas.client = null;
    return ['oas'];
  }
};
