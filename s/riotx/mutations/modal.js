import { reject } from 'mout/array';
import constants from '../../core/constants';

let counter = 0;
const generateID = () => {
  counter = counter + 1;
  return `modal_${counter}`;
};

export default {
  add: (context, tagName, tagOpts = {}, modalOpts = {}) => {
    context.state.modal.list.push({
      id : generateID(),
      tagName,
      tagOpts,
      modalOpts
    });
    return [constants.CHANGE_MODAL];
  },

  remove: (context, modalID) => {
    context.state.modal.list = reject(context.state.modal.list, modal => {
      if (modal.id === modalID) {
        return true;
      }
      return false;
    });
    return [constants.CHANGE_MODAL];
  }
};
