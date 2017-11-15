import exporter from './exporter';

export default exporter('ua', {
  /**
   * 全情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    return state.ua;
  },

  /**
   * Chromeか否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isChrome: state => {
    return !!state.ua.chrome;
  },

  /**
   * Safariか否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isSafari: state => {
    return !!state.ua.safari;
  },

  /**
   * Edgeか否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isEdge: state => {
    return !!state.ua.edge;
  },

  /**
   * Firefoxか否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isFirefox: state => {
    return !!state.ua.firefox;
  },

  /**
   * 使用しているブラウザを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  usingBrowser: state => {
    const ua = state.ua;
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
});
