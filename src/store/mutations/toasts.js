import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

const generateId = () => {
  return `toast_${Date.now()}`;
};

const TOAST_TIMEOUT = 1000;

export default exporter('toasts', {
  /**
   * トーストを追加します。
   * @param {Object} state
   * @param {Object} obj
   * @return {Array}
   */
  add: (state, obj) => {
    const data = ObjectAssign({
      timeout: TOAST_TIMEOUT,
      autoHide: true
    }, obj, {
      id: generateId()
    });

    state.toasts.push(data);
    return ['toasts'];
  },

  /**
   * トーストを削除します。
   * @param {Object} state
   * @param {String} toastId
   * @return {Array}
   */
  remove: (state, toastId) => {
    state.toasts = reject(state.toasts, toast => {
      return toast.id === toastId;
    });

    return ['toasts'];
  }
});
