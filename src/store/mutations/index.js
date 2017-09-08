import application from './application';
import components from './components';
import current from './current';
import dmc from './dmc';
import drawers from './drawers';
import endpoints from './endpoints';
import layout from './layout';
import location from './location';
import modals from './modals';
import oas from './oas';
import page from './page';
import toasts from './toasts';
import ua from './ua';

const constants = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION: 'APPLICATION_NAVIGATION',
  APPLICATION_NETWORKINGS_ADD: 'APPLICATION_NETWORKINGS_ADD',
  APPLICATION_NETWORKINGS_REMOVE: 'APPLICATION_NETWORKINGS_REMOVE',
  APPLICATION_DRAG: 'APPLICATION_DRAG',
  APPLICATION_ENDPOINT_FILTER_TEXT: 'APPLICATION_ENDPOINT_FILTER_TEXT',
  COMPONENTS_UPDATE_ONE: 'COMPONENTS_UPDATE_ONE',
  COMPONENTS_REMOVE_ONE: 'COMPONENTS_REMOVE_ONE',
  COMPONENTS_REMOVE_ALL: 'COMPONENTS_REMOVE_ALL',
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  DRAWERS_ADD: 'DRAWERS_ADD',
  DRAWERS_REMOVE: 'DRAWERS_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_UPDATE_TOKEN: 'ENDPOINTS_UPDATE_TOKEN',
  ENDPOINTS_MERGE_ALL: 'ENDPOINTS_MERGE_ALL',
  ENDPOINTS_TIDY_UP_ORDER: 'ENDPOINTS_TIDY_UP_ORDER',
  ENDPOINTS_CHANGE_ORDER: 'ENDPOINTS_CHANGE_ORDER',
  LAYOUT_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION: 'LOCATION',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAS_CLIENT: 'OAS_CLIENT',
  OAS_CLIENT_CLEAR: 'OAS_CLIENT_CLEAR',
  PAGE: 'PAGE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE',
  UA: 'UA'
};

export default {
  [constants.APPLICATION_LAUNCH]: application.launch,
  [constants.APPLICATION_NAVIGATION]: application.navigation,
  [constants.APPLICATION_NETWORKINGS_ADD]: application.addNetworking,
  [constants.APPLICATION_NETWORKINGS_REMOVE]: application.removeNetworking,
  [constants.APPLICATION_DRAG]: application.drag,
  [constants.APPLICATION_ENDPOINT_FILTER_TEXT]: application.endpointFilterText,
  [constants.COMPONENTS_UPDATE_ONE]: components.updateOne,
  [constants.COMPONENTS_REMOVE_ONE]: components.removeOne,
  [constants.COMPONENTS_REMOVE_ALL]: components.removeAll,
  [constants.CURRENT]: current.all,
  [constants.DMC]: dmc.all,
  [constants.DRAWERS_ADD]: drawers.add,
  [constants.DRAWERS_REMOVE]: drawers.remove,
  [constants.ENDPOINTS_ADD]: endpoints.add,
  [constants.ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.ENDPOINTS_UPDATE]: endpoints.update,
  [constants.ENDPOINTS_UPDATE_TOKEN]: endpoints.updateToken,
  [constants.ENDPOINTS_MERGE_ALL]: endpoints.mergeAll,
  [constants.ENDPOINTS_TIDY_UP_ORDER]: endpoints.tidyUpOrder,
  [constants.ENDPOINTS_CHANGE_ORDER]: endpoints.changeOrder,
  [constants.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT]: layout.updateComponentsGridColumnCount,
  [constants.LOCATION]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MODALS_ADD]: modals.add,
  [constants.MODALS_REMOVE]: modals.remove,
  [constants.OAS_CLIENT]: oas.client,
  [constants.OAS_CLIENT_CLEAR]: oas.clearClient,
  [constants.PAGE]: page.all,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove,
  [constants.UA]: ua.all
};

export {
  constants
};
