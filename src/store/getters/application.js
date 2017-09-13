export default {
  /**
   * `application`情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.application;
  },

  /**
   * 起動状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isLaunched: context => {
    return context.state.application.isLaunched;
  },

  /**
   * 遷移中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isNavigating: context => {
    return context.state.application.isNavigating;
  },

  /**
   * API通信中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isNetworking: context => {
    return context.state.application.isNetworking;
  },

  /**
   * ドラッグ中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isDragging: context => {
    return context.state.application.isDragging;
  },

  /**
   * エンドポイントフィルター用のテキストを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  endpointFilterText: context => {
    return context.state.application.endpointFilterText;
  }
};
