import { reject } from 'mout/array';
import ObjectAssign from 'object-assign';
import constants from '../../core/constants';

let counter = 0;
const generateID = () => {
  counter = counter + 1;
  return `modal_${counter}`;
};

export default {
  add: (context, obj) => {
    context.state.modal.list.push(ObjectAssign({}, obj, {
      id: generateID()
    }));
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
