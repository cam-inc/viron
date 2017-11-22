import reject from 'mout/array/reject';
import exporter from './exporter';

export default exporter('modals', {
  /**
   * モーダルを追加します。
   * @param {Object} state
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Array}
   */
  add: (state, tagName, tagOpts = {}, modalOpts = {}) => {
    state.modals.push({
      id: `modal_${Date.now()}`,
      tagName,
      tagOpts,
      modalOpts
    });
    return ['modals'];
  },

  /**
   * モーダルを削除します。
   * @param {Object} state
   * @param {String} modalID
   * @return {Array}
   */
  remove: (state, modalID) => {
    state.modals = reject(state.modals, modal => {
      return (modal.id === modalID);
    });
    return ['modals'];
  }
});
