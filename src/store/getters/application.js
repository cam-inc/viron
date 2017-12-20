import exporter from './exporter';

export default exporter('application', {
  /**
   * `application`情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    return state.application;
  },

  /**
   * バージョンを返します。
   * @param {Object} state
   * @return {String}
   */
  version: state => {
    return state.application.version;
  },

  /**
   * 最新バージョンを返します。
   * @param {Object} state
   * @return {String}
   */
  latestVersion: state => {
    return state.application.latestVersion;
  },

  /**
   * 起動状態を返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isLaunched: state => {
    return state.application.isLaunched;
  },

  /**
   * 遷移中か否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isNavigating: state => {
    return state.application.isNavigating;
  },

  /**
   * API通信中か否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isNetworking: state => {
    return state.application.isNetworking;
  },

  /**
   * ドラッグ中か否かを返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isDragging: state => {
    return state.application.isDragging;
  },

  /**
   * メニューの開閉状態を返します。
   * @param {Object} state
   * @return {Boolean}
   */
  isMenuOpened: state => {
    return state.application.isMenuOpened;
  },

  /**
   * エンドポイントフィルター用のテキストを返します。
   * @param {Object} state
   * @return {String}
   */
  endpointFilterText: state => {
    return state.application.endpointFilterText;
  },

  /**
   * エンドポイントフィルター用の一時テキストを返します。
   * @param {Object} state
   * @return {String}
   */
  endpointTempFilterText: state => {
    return state.application.endpointTempFilterText;
  }
});
