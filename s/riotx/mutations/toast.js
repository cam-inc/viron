import { reject } from 'mout/array';
import ObjectAssign from 'object-assign';
import storage from 'store';

import constants from '../../core/constants';

const generateID = () => {
  return `toast_${Date.now()}`;
};

const TOAST_TYPE_NORMAL = 'normal';
const TOAST_TIMEOUT = 3 * 1000;
const TOAST_AUTO_HIDE = true;

export default {
  add: (context, obj) => {
    const data = ObjectAssign({
      type: TOAST_TYPE_NORMAL,
      timeout: TOAST_TIMEOUT,
      autoHide: TOAST_AUTO_HIDE
    }, obj, {
      id: generateID()
    });

    console.log('add toast', data); // TODO

    context.state.toasts.push(data);
    storage.set(constants.STORAGE_TOAST, context.state.toasts);
    return [constants.CHANGE_TOAST];
  },

  remove: (context, toastID) => {
    context.state.toasts = reject(context.state.toasts, toast => {
      return toast.id === toastID;
    });
    storage.set(constants.STORAGE_TOAST, context.state.toasts);

    return [constants.CHANGE_TOAST];
  }
};
