import location from './location';
import modal from './modal';

const constants = {
  LOCATION_ALL: 'LOCATION_ALL',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MODAL_ADD: 'MODAL_ADD',
  MODAL_REMOVE: 'MODAL_REMOVE'
};

export default {
  [constants.LOCATION_ALL]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MODAL_ADD]: modal.add,
  [constants.MODAL_REMOVE]: modal.remove
};

export {
  constants
};
