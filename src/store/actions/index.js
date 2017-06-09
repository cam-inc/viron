import application from './application';
import modal from './modal';
import page from './page';

const constants = {
  MODAL_ADD: 'MODAL_ADD',
  MODAL_REMOVE: 'MODAL_REMOVE',
  PAGE_UPDATE: 'PAGE_UPDATE'
};

export default {
  [constants.MODAL_ADD]: modal.add,
  [constants.MODAL_REMOVE]: modal.remove,
  [constants.PAGE_UPDATE]: page.update
};

export {
  constants
};
