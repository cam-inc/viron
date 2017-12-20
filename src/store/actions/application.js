import exporter from './exporter';

export default exporter('application', {
  /**
   * 起動状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  launch: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.launch', true);
      });
  },

  /**
   * 画面遷移状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  startNavigation: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.navigation', true);
      });
  },

  /**
   * 画面遷移完了状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  endNavigation: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.navigation', false);
      });
  },

  /**
   * ドラッグ状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  startDrag: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.drag', true);
      });
  },

  /**
   * ドラッグ完了状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  endDrag: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.drag', false);
      });
  },

  /**
   * メニューの開閉状態をトグルします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  toggleMenu: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.menuToggle');
      });
  },

  /**
   * エンドポイントフィルター用のテキストを更新します。
   * @param {riotx.Context} context
   * @param {String} newFilterText
   * @return {Promise}
   */
  updateEndpointFilterText: (context, newFilterText) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.endpointFilterText', newFilterText);
        context.commit('application.endpointTempFilterText', newFilterText);
      });
  },

  /**
   * エンドポイントフィルター用の一時テキストを更新します。
   * @param {riotx.Context} context
   * @param {String} newTempFilterText
   * @return {Promise}
   */
  updateEndpointTempFilterText: (context, newTempFilterText) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.endpointTempFilterText', newTempFilterText);
      });
  },

  /**
   * エンドポイントフィルター用のテキストをリセットします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  resetEndpointFilterText: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('application.endpointFilterText', '');
        context.commit('application.endpointTempFilterText', '');
      });
  }
});
