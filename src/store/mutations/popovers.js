import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('popovers', {
  /**
   * 吹き出しを追加します。
   * @param {Object} state
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} popoverOpts
   * @return {Array}
   */
  add: (state, tagName, tagOpts = {}, popoverOpts = {}) => {
    state.popovers.push({
      id: `popover_${Date.now()}`,
      tagName,
      tagOpts,
      popoverOpts: ObjectAssign({
        direction: 'T',
        width: 100,
        x: 0,
        y: 0
      }, popoverOpts)
    });
    return ['popovers'];
  },

  /**
   * 吹き出しを削除します。
   * @param {Object} state
   * @param {String} popoverID
   * @return {Array}
   */
  remove: (state, popoverID) => {
    state.popovers = reject(state.popovers, popover => {
      return (popover.id === popoverID);
    });
    return ['popovers'];
  },

  /**
   * 全ての吹き出しを削除します。
   * @param {Object} state
   * @return {Array}
   */
  removeAll: state => {
    state.popovers = [];
    return ['popovers'];
  }
});
