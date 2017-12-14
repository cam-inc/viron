import exporter from './exporter';

// 多重起動しないよう判定する変数
let canCreateMediapreview = true;
// タイマーID管理用変数
let timer;

export default exporter('mediapreviews', {
  /**
   * メディアプレビューを追加します。
   * @param {riotx.Context} context
   * @param {Object} tagOpts
   * @param {Object} mediapreviewOpts
   * @return {Promise}
   */
  add: (context, tagOpts, mediapreviewOpts) => {
    if (!canCreateMediapreview) {
      console.warn('多重に起動しないよう、一定時間の作成を規制する。'); // eslint-disable-line no-console
      return Promise.resolve();
    }

    // 作成を一時的に不可にする。
    canCreateMediapreview = false;
    clearTimeout(timer);

    // 一定時間後に作成可とする。
    timer = setTimeout(() => {
      canCreateMediapreview = true;
    }, 300);

    return Promise
      .resolve()
      .then(() => {
        context.commit('mediapreviews.add', tagOpts, mediapreviewOpts);
      });
  },

  /**
   * メディアプレビューを削除します。
   * @param {riotx.Context} context
   * @param {String} mediapreviewId
   * @return {Promise}
   */
  remove: (context, mediapreviewId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit('mediapreviews.remove', mediapreviewId);
      });
  }
});
