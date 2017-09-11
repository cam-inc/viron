import { constants as mutations } from '../mutations';

export default {
  /**
   * 起動状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  launch: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.APPLICATION_LAUNCH, true);
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
        context.commit(mutations.APPLICATION_NAVIGATION, true);
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
        context.commit(mutations.APPLICATION_NAVIGATION, false);
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
        context.commit(mutations.APPLICATION_DRAG, true);
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
        context.commit(mutations.APPLICATION_DRAG, false);
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
        context.commit(mutations.APPLICATION_ENDPOINT_FILTER_TEXT, newFilterText);
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
        context.commit(mutations.APPLICATION_ENDPOINT_FILTER_TEXT, '');
      });
  }
};
