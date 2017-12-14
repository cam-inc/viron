import exporter from './exporter';

export default exporter('mediapreviews', {
  /**
   * 全てのメディアプレビュー情報を返します。
   * @param {Object} state
   * @return {Array}
   */
  all: state => {
    return state.mediapreviews;
  }
});
