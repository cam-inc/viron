export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.ua;
  },

  /**
   * Chromeか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isChrome: context => {
    return !!context.state.ua.chrome;
  },

  /**
   * Safariか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isSafari: context => {
    return !!context.state.ua.safari;
  },

  /**
   * Edgeか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isEdge: context => {
    return !!context.state.ua.edge;
  },

  /**
   * Firefoxか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isFirefox: context => {
    return !!context.state.ua.firefox;
  },

  /**
   * 使用しているブラウザを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  usingBrowser: context => {
    const ua = context.state.ua;
    if (!!ua.chrome) {
      return 'chrome';
    }
    if (!!ua.safari) {
      return 'safari';
    }
    if (!!ua.edge) {
      return 'edge';
    }
    if (!!ua.firefox) {
      return 'firefox';
    }

    return null;
  }
};
