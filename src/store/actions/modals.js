import { constants as mutations } from '../mutations';

// モーダルを多重起動しないよう判定する変数
let canCreateModal = true;
let timer;

export default {
  /**
   * モーダルを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, modalOpts) => {
    if (!canCreateModal) {
      return;
    }

    // モーダル作成を一時的に不可にする。
    console.warn('多重に起動しないよう、一定時間のモーダル作成を規制する。'); // eslint-disable-line no-console
    canCreateModal = false;
    clearTimeout(timer);

    // 一定時間後に作成可とする。
    timer = setTimeout(() => {
      canCreateModal = true;
    }, 300);

    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MODALS_ADD, tagName, tagOpts, modalOpts);
      });
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalId
   * @return {Promise}
   */
  remove: (context, modalId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(mutations.MODALS_REMOVE, modalId);
      });
  }
};
