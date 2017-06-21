import application from './application';
import auth from './auth';
import current from './current';
import dmc from './dmc';
import endpoints from './endpoints';
import location from './location';
import menu from './menu';
import modals from './modals';
import oauthEndpointKey from './oauthEndpointKey';
import toasts from './toasts';

const constants = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION_START: 'APPLICATION_NAVIGATION_START',
  APPLICATION_NAVIGATION_END: 'APPLICATION_NAVIGATION_END',
  AUTH_UPDATE: 'AUTH_UPADTE',
  AUTH_REMOVE: 'AUTH_REMOVE',
  AUTH_VALIDATE: 'AUTH_VALIDATE',
  AUTH_GET_TYPES: 'AUTH_GET_TYPES',
  AUTH_SIGNIN_OAUTH: 'AUTH_SIGNIN_OAUTH',
  AUTH_SIGNIN_EMAIL: 'AUTH_SIGNIN_EMAIL',
  CURRENT_UPDATE: 'CURRENT_UPDATE',
  CURRENT_REMOVE: 'CURRENT_REMOVE',
  DMC_GET: 'DMC_GET',
  DMC_REMOVE: 'DMC_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  MENU_TOGGLE: 'MENU_TOGGLE',
  MENU_OPEN: 'MENU_OPEN',
  MENU_CLOSE: 'MENU_CLOSE',
  MENU_ENABLE: 'MENU_ENABLE',
  MENU_DISABLE: 'MENU_DISABLE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAUTH_ENDPOINT_KEY_REMOVE: 'OAUTH_ENDPOINT_KEY_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE'
};

export default {
  [constants.APPLICATION_LAUNCH]: application.launch,
  [constants.APPLICATION_NAVIGATION_START]: application.startNavigation,
  [constants.APPLICATION_NAVIGATION_END]: application.endNavigation,
  [constants.AUTH_UPDATE]: auth.update,
  [constants.AUTH_REMOVE]: auth.remove,
  [constants.AUTH_VALIDATE]: auth.validate,
  [constants.AUTH_GET_TYPES]: auth.getTypes,
  [constants.AUTH_SIGNIN_OAUTH]: auth.signinOAuth,
  [constants.AUTH_SIGNIN_EMAIL]: auth.signinEmail,
  [constants.CURRENT_UPDATE]: current.update,
  [constants.CURRENT_REMOVE]: current.remove,
  [constants.DMC_GET]: dmc.get,
  [constants.DMC_REMOVE]: dmc.remove,
  [constants.ENDPOINTS_ADD]: endpoints.add,
  [constants.ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.LOCATION_UPDATE]: location.update,
  [constants.MENU_TOGGLE]: menu.toggle,
  [constants.MENU_OPEN]: menu.open,
  [constants.MENU_CLOSE]: menu.close,
  [constants.MENU_ENABLE]: menu.enable,
  [constants.MENU_DISABLE]: menu.disable,
  [constants.MODALS_ADD]: modals.add,
  [constants.MODALS_REMOVE]: modals.remove,
  [constants.OAUTH_ENDPOINT_KEY_REMOVE]: oauthEndpointKey.remove,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove
};

export {
  constants
};
