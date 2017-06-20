import current from './current';
import location from './location';
import menu from './menu';
import modals from './modals';
import toasts from './toasts';

const constants = {
  CURRENT: 'CURRENT',
  LOCATION: 'LOCATION',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MENU_TOGGLE: 'MENU_TOGGLE',
  MENU_OPEN: 'MENU_OPEN',
  MENU_CLOSE: 'MENU_CLOSE',
  MENU_ENABLE: 'MENU_ENABLE',
  MENU_DISABLE: 'MENU_DISABLE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE'
};

export default {
  [constants.CURRENT]: current.all,
  [constants.LOCATION]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MENU_TOGGLE]: menu.toggle,
  [constants.MENU_OPEN]: menu.open,
  [constants.MENU_CLOSE]: menu.close,
  [constants.MENU_ENABLE]: menu.enable,
  [constants.MENU_DISABLE]: menu.disable,
  [constants.MODALS_ADD]: modals.add,
  [constants.MODALS_REMOVE]: modals.remove,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove
};

export {
  constants
};
