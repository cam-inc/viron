import reject from 'mout/array/reject';
import exporter from './exporter';

export default exporter('mediapreviews', {
  /**
   * メディアプレビューを追加します。
   * @param {Object} state
   * @param {Object} tagOpts
   * @param {Object} mediapreviewOpts
   * @return {Array}
   */
  add: (state, tagOpts = {}, mediapreviewOpts = {}) => {
    state.mediapreviews.push({
      id: `mediapreview_${Date.now()}`,
      tagOpts,
      mediapreviewOpts
    });
    return ['mediapreviews'];
  },

  /**
   * メディアプレビューを削除します。
   * @param {Object} state
   * @param {String} mediapreviewID
   * @return {Array}
   */
  remove: (state, mediapreviewID) => {
    state.mediapreviews = reject(state.mediapreviews, mediapreview => {
      return (mediapreview.id === mediapreviewID);
    });
    return ['mediapreviews'];
  }
});
