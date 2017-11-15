import reject from 'mout/array/reject';
import ObjectAssign from 'object-assign';

const generateId = () => {
  return `toast_${Date.now()}`;
};

const TOAST_TYPE_NORMAL = 'normal';
const TOAST_TIMEOUT = 3 * 1000;
const TOAST_AUTO_HIDE = true;

export default {
  /**
   * トーストを追加します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Array}
   */
  add: (context, obj) => {
    const data = ObjectAssign({
      type: TOAST_TYPE_NORMAL,
      timeout: TOAST_TIMEOUT,
      autoHide: TOAST_AUTO_HIDE
    }, obj, {
      id: generateId()
    });

    context.state.toasts.push(data);
    return ['toasts'];
  },

  /**
   * トーストを削除します。
   * @param {riotx.Context} context
   * @param {String} toastId
   * @return {Array}
   */
  remove: (context, toastId) => {
    context.state.toasts = reject(context.state.toasts, toast => {
      return toast.id === toastId;
    });

    return ['toasts'];
  }
};
