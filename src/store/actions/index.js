import application from './application';
import auth from './auth';
import components from './components';
import current from './current';
import dmc from './dmc';
import drawers from './drawers';
import endpoints from './endpoints';
import layout from './layout';
import location from './location';
import menu from './menu';
import modals from './modals';
import oas from './oas';
import oauthEndpointKey from './oauthEndpointKey';
import page from './page';
import toasts from './toasts';
import ua from './ua';

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
  COMPONENTS_GET_ONE: 'COMPONENTS_GET_ONE',
  COMPONENTS_OPERATE_ONE: 'COMPONENTS_OPERATE_ONE',
  COMPONENTS_REMOVE_ONE: 'COMPONENTS_REMOVE_ONE',
  COMPONENTS_REMOVE_ALL: 'COMPONENTS_REMOVE_ALL',
  CURRENT_UPDATE: 'CURRENT_UPDATE',
  CURRENT_REMOVE: 'CURRENT_REMOVE',
  DMC_GET: 'DMC_GET',
  DMC_REMOVE: 'DMC_REMOVE',
  DRAWERS_ADD: 'DRAWERS_ADD',
  DRAWERS_REMOVE: 'DRAWERS_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  LAYOUT_UPDATE_ENDPOINTS_GRID_COLUMN_COUNT: 'LAYOUT_UPDATE_ENDPOINTS_GRID_COLUMN_COUNT',
  LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  MENU_TOGGLE: 'MENU_TOGGLE',
  MENU_OPEN: 'MENU_OPEN',
  MENU_CLOSE: 'MENU_CLOSE',
  MENU_ENABLE: 'MENU_ENABLE',
  MENU_DISABLE: 'MENU_DISABLE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAS_SETUP: 'OAS_SETUP',
  OAS_CLEAR: 'OAS_CLEAR',
  OAUTH_ENDPOINT_KEY_REMOVE: 'OAUTH_ENDPOINT_KEY_REMOVE',
  PAGE_GET: 'PAGE_GET',
  PAGE_REMOVE: 'PAGE_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE',
  UA_SETUP: 'UA_SETUP'
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
  [constants.COMPONENTS_GET_ONE]: components.get,
  [constants.COMPONENTS_OPERATE_ONE]: components.operate,
  [constants.COMPONENTS_REMOVE_ONE]: components.remove,
  [constants.COMPONENTS_REMOVE_ALL]: components.removeAll,
  [constants.CURRENT_UPDATE]: current.update,
  [constants.CURRENT_REMOVE]: current.remove,
  [constants.DMC_GET]: dmc.get,
  [constants.DMC_REMOVE]: dmc.remove,
  [constants.DRAWERS_ADD]: drawers.add,
  [constants.DRAWERS_REMOVE]: drawers.remove,
  [constants.ENDPOINTS_ADD]: endpoints.add,
  [constants.ENDPOINTS_UPDATE]: endpoints.update,
  [constants.ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.LAYOUT_UPDATE_ENDPOINTS_GRID_COLUMN_COUNT]: layout.updateEndpointsGridColumnCount,
  [constants.LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT]: layout.updateComponentsGridColumnCount,
  [constants.LOCATION_UPDATE]: location.update,
  [constants.MENU_TOGGLE]: menu.toggle,
  [constants.MENU_OPEN]: menu.open,
  [constants.MENU_CLOSE]: menu.close,
  [constants.MENU_ENABLE]: menu.enable,
  [constants.MENU_DISABLE]: menu.disable,
  [constants.MODALS_ADD]: modals.add,
  [constants.MODALS_REMOVE]: modals.remove,
  [constants.OAS_SETUP]: oas.setup,
  [constants.OAS_CLEAR]: oas.clear,
  [constants.OAUTH_ENDPOINT_KEY_REMOVE]: oauthEndpointKey.remove,
  [constants.PAGE_GET]: page.get,
  [constants.PAGE_REMOVE]: page.remove,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove,
  [constants.UA_SETUP]: ua.setup
};

export {
  constants
};
