import location from './location';
import modal from './modal';

const constants = {
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  MODAL_ADD: 'MODAL_ADD',
  MODAL_REMOVE: 'MODAL_REMOVE'
};

export default {
  [constants.LOCATION_UPDATE]: location.update,
  [constants.MODAL_ADD]: modal.add,
  [constants.MODAL_REMOVE]: modal.remove
};

export {
  constants
};
