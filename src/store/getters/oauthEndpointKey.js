export default {
  /**
   * OAuth認証中のendpointKeyを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  all: context => {
    return context.state.oauthEndpointKey;
  }
};
