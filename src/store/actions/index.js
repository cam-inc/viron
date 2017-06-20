import current from './current';
import location from './location';
import menu from './menu';
import modals from './modals';
import toasts from './toasts';

const constants = {
  CURRENT_UPDATE: 'CURRENT_UPDATE',
  CURRENT_REMOVE: 'CURRENT_REMOVE',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
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
  [constants.CURRENT_UPDATE]: current.update,
  [constants.CURRENT_REMOVE]: current.remove,
  [constants.LOCATION_UPDATE]: location.update,
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
