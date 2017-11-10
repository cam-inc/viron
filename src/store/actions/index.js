import application from './application';
import auth from './auth';
import components from './components';
import current from './current';
import viron from './viron';
import drawers from './drawers';
import endpoints from './endpoints';
import layout from './layout';
import location from './location';
import modals from './modals';
import oas from './oas';
import page from './page';
import popovers from './popovers';
import toasts from './toasts';
import ua from './ua';

const constants = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION_START: 'APPLICATION_NAVIGATION_START',
  APPLICATION_NAVIGATION_END: 'APPLICATION_NAVIGATION_END',
  APPLICATION_DRAG_START: 'APPLICATION_DRAG_START',
  APPLICATION_DRAG_END: 'APPLICATION_DRAG_END',
  APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT: 'APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT',
  APPLICATION_RESET_ENDPOINT_FILTER_TEXT: 'APPLICATION_RESET_ENDPOINT_FILTER_TEXT',
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
  VIRON_GET: 'VIRON_GET',
  VIRON_REMOVE: 'VIRON_REMOVE',
  DRAWERS_ADD: 'DRAWERS_ADD',
  DRAWERS_REMOVE: 'DRAWERS_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  ENDPOINTS_MERGE_ALL: 'ENDPOINTS_MERGE_ALL',
  ENDPOINTS_MERGE_ONE_WITH_KEY: 'ENDPOINTS_MERGE_ONE_WITH_KEY',
  ENDPOINTS_TIDY_UP_ORDER: 'ENDPOINTS_TIDY_UP_ORDER',
  ENDPOINTS_CHANGE_ORDER: 'ENDPOINTS_CHANGE_ORDER',
  LAYOUT_UPDATE_SIZE: 'LAYOUT_UPDATE_SIZE',
  LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAS_SETUP: 'OAS_SETUP',
  OAS_CLEAR: 'OAS_CLEAR',
  OAS_GET_AUTOCOMPLETE: 'OAS_GET_AUTOCOMPLETE',
  OAUTH_ENDPOINT_KEY_REMOVE: 'OAUTH_ENDPOINT_KEY_REMOVE',
  PAGE_GET: 'PAGE_GET',
  PAGE_REMOVE: 'PAGE_REMOVE',
  POPOVERS_ADD: 'POPOVERS_ADD',
  POPOVERS_REMOVE: 'POPOVERS_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE',
  UA_SETUP: 'UA_SETUP'
};

export default {
  [constants.APPLICATION_LAUNCH]: application.launch,
  [constants.APPLICATION_NAVIGATION_START]: application.startNavigation,
  [constants.APPLICATION_NAVIGATION_END]: application.endNavigation,
  [constants.APPLICATION_DRAG_START]: application.startDrag,
  [constants.APPLICATION_DRAG_END]: application.endDrag,
  [constants.APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT]: application.updateEndpointFilterText,
  [constants.APPLICATION_RESET_ENDPOINT_FILTER_TEXT]: application.resetEndpointFilterText,
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
  [constants.VIRON_GET]: viron.get,
  [constants.VIRON_REMOVE]: viron.remove,
  [constants.DRAWERS_ADD]: drawers.add,
  [constants.DRAWERS_REMOVE]: drawers.remove,
  [constants.ENDPOINTS_ADD]: endpoints.add,
  [constants.ENDPOINTS_UPDATE]: endpoints.update,
  [constants.ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.ENDPOINTS_MERGE_ALL]: endpoints.mergeAll,
  [constants.ENDPOINTS_MERGE_ONE_WITH_KEY]: endpoints.mergeOneWithKey,
  [constants.ENDPOINTS_TIDY_UP_ORDER]: endpoints.tidyUpOrder,
  [constants.ENDPOINTS_CHANGE_ORDER]: endpoints.changeOrder,
  [constants.LAYOUT_UPDATE_SIZE]: layout.updateSize,
  [constants.LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT]: layout.updateComponentsGridColumnCount,
  [constants.LOCATION_UPDATE]: location.update,
  [constants.MODALS_ADD]: modals.add,
  [constants.MODALS_REMOVE]: modals.remove,
  [constants.OAS_SETUP]: oas.setup,
  [constants.OAS_CLEAR]: oas.clear,
  [constants.OAS_GET_AUTOCOMPLETE]: oas.getAutocomplete,
  [constants.PAGE_GET]: page.get,
  [constants.PAGE_REMOVE]: page.remove,
  [constants.POPOVERS_ADD]: popovers.add,
  [constants.POPOVERS_REMOVE]: popovers.remove,
  [constants.TOASTS_ADD]: toasts.add,
  [constants.TOASTS_REMOVE]: toasts.remove,
  [constants.UA_SETUP]: ua.setup
};

export {
  constants
};
