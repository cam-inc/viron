import application from './application';
import components from './components';
import current from './current';
import dmc from './dmc';
import endpoints from './endpoints';
import location from './location';
import menu from './menu';
import modals from './modals';
import oauthEndpointKey from './oauthEndpointKey';
import page from './page';
import toasts from './toasts';

const constants = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION: 'APPLICATION_NAVIGATION',
  APPLICATION_NETWORKING_ADD: 'APPLICATION_NETWORKINGS_ADD',
  APPLICATION_NETWORKING_REMOVE: 'APPLICATION_NETWORKINGS_REMOVE',
  COMPONENTS_UPDATE_ONE: 'COMPONENTS_UPDATE_ONE',
  COMPONENTS_REMOVE_ONE: 'COMPONENTS_REMOVE_ONE',
  COMPONENTS_REMOVE_ALL: 'COMPONENTS_REMOVE_ALL',
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_UPDATE_TOKEN: 'ENDPOINTS_UPDATE_TOKEN',
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
  OAUTH_ENDPOINT_KEY: 'OAUTH_ENDPOINT_KEY',
  PAGE: 'PAGE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE'
};

export default {
  [constants.APPLICATION_LAUNCH]: application.launch,
  [constants.APPLICATION_NAVIGATION]: application.navigation,
  [constants.APPLICATION_NETWORKINGS_ADD]: application.addNetworking,
  [constants.APPLICATION_NETWORKINGS_REMOVE]: application.removeNetworking,
  [constants.COMPONENTS_UPDATE_ONE]: components.updateOne,
  [constants.COMPONENTS_REMOVE_ONE]: components.removeOne,
  [constants.COMPONENTS_REMOVE_ALL]: components.removeAll,
  [constants.CURRENT]: current.all,
  [constants.DMC]: dmc.all,
  [constants.ENDPOINTS_ADD]: endpoints.add,
  [constants.ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.ENDPOINTS_UPDATE]: endpoints.update,
  [constants.ENDPOINTS_UPDATE_TOKEN]: endpoints.updateToken,
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
  [constants.OAUTH_ENDPOINT_KEY]: oauthEndpointKey.all,
  [constants.PAGE]: page.all,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove
};

export {
  constants
};
