import application from './application';
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
import page from './page';
import toasts from './toasts';
import ua from './ua';

const constants = {
  APPLICATION: 'APPLICATION',
  APPLICATION_ISLAUNCHED: 'APPLICATION_ISLAUNCHED',
  APPLICATION_ISNAVIGATING: 'APPLICATION_ISNAVIGATING',
  APPLICATION_ISNETWORKING: 'APPLICATION_ISNETWORKING',
  COMPONENTS: 'COMPONENTS',
  COMPONENTS_ONE: 'COMPONENTS_ONE',
  COMPONENTS_ONE_RESPONSE: 'COMPONENTS_ONE_RESPONSE',
  COMPONENTS_ONE_SCHEMA_OBJECT: 'COMPONENTS_ONE_SCHEMA_OBJECT',
  COMPONENTS_ONE_PARAMETER_OBJECTS: 'COMPONENTS_ONE_PARAMETER_OBJECTS',
  COMPONENTS_ONE_ACTIONS: 'COMPONENTS_ONE_ACTIONS',
  COMPONENTS_ONE_ACTIONS_SELF: 'COMPONENTS_ONE_ACTIONS_SELF',
  COMPONENTS_ONE_ACTIONS_ROW: 'COMPONENTS_ONE_ACTIONS_ROW',
  COMPONENTS_ONE_HAS_PAGINATION: 'COMPONENTS_ONE_HAS_PAGINATION',
  COMPONENTS_ONE_PAGINATION: 'COMPONENTS_ONE_PAGINATION',
  COMPONENTS_ONE_TABLE_LABELS: 'COMPONENTS_ONE_TABLE_LABELS',
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  DMC_EXISTENCE: 'DMC_EXISTENCE',
  DMC_PAGES: 'DMC_PAGES',
  DMC_PAGES_ID_OF: 'DMC_PAGES_ID_OF',
  DMC_NAME: 'DMC_NAME',
  DMC_DASHBOARD: 'DMC_DASHBOARD',
  DMC_MANAGE: 'DMC_MANAGE',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  ENDPOINTS_COUNT: 'ENDPOINTS_COUNT',
  ENDPOINTS_WITHOUT_TOKEN: 'ENDPOINTS_WITHOUT_TOKEN',
  ENDPOINTS_ONE: 'ENDPOINTS_ONE',
  ENDPOINTS_ONE_BY_URL: 'ENDPOINTS_ONE_BY_URL',
  LAYOUT_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION: 'LOCATION',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MENU_ENABLED: 'MENU_ENABLED',
  MODALS: 'MODALS',
  OAS_CLIENT: 'OAS_CLIENT',
  OAS_SPEC: 'OAS_SPEC',
  OAS_ORIGINAL_SPEC: 'OAS_ORIGINAL_SPEC',
  OAS_APIS: 'OAS_APIS',
  OAS_FLAT_APIS: 'OAS_FLAT_APIS',
  OAS_API: 'OAS_API',
  OAS_API_BY_PATH_AND_METHOD: 'OAS_API_BY_PATH_AND_METHOD',
  OAS_PATH_ITEM_OBJECT: 'OAS_PATH_ITEM_OBJECT',
  OAS_OPERATION_OBJECT: 'OAS_OPERATION_OBJECT',
  OAS_OPERATION_ID: 'OAS_OPERATION_ID',
  OAS_PARAMETER_OBJECTS: 'OAS_PARAMETER_OBJECTS',
  OAS_RESPONSE_OBJECT: 'OAS_RESPONSE_OBJECT',
  OAS_SCHEMA_OBJECT: 'OAS_SCHEMA_OBJECT',
  PAGE: 'PAGE',
  PAGE_ID: 'PAGE_ID',
  PAGE_NAME: 'PAGE_NAME',
  PAGE_COMPONENTS: 'PAGE_COMPONENTS',
  PAGE_COMPONENTS_COUNT: 'PAGE_COMPONENTS_COUNT',
  TOASTS: 'TOASTS',
  UA: 'UA'
};

export default {
  [constants.APPLICATION]: application.all,
  [constants.APPLICATION_ISLAUNCHED]: application.isLaunched,
  [constants.APPLICATION_ISNAVIGATING]: application.isNavigating,
  [constants.APPLICATION_ISNETWORKING]: application.isNetworking,
  [constants.COMPONENTS]: components.all,
  [constants.COMPONENTS_ONE]: components.one,
  [constants.COMPONENTS_ONE_RESPONSE]: components.response,
  [constants.COMPONENTS_ONE_SCHEMA_OBJECT]: components.schemaObject,
  [constants.COMPONENTS_ONE_PARAMETER_OBJECTS]: components.parameterObjects,
  [constants.COMPONENTS_ONE_ACTIONS]: components.actions,
  [constants.COMPONENTS_ONE_ACTIONS_SELF]: components.selfActions,
  [constants.COMPONENTS_ONE_ACTIONS_ROW]: components.rowActions,
  [constants.COMPONENTS_ONE_HAS_PAGINATION]: components.hasPagination,
  [constants.COMPONENTS_ONE_PAGINATION]: components.pagination,
  [constants.COMPONENTS_ONE_TABLE_LABELS]: components.tableLabels,
  [constants.CURRENT]: current.all,
  [constants.DMC]: dmc.all,
  [constants.DMC_EXISTENCE]: dmc.existence,
  [constants.DMC_PAGES]: dmc.pages,
  [constants.DMC_PAGES_ID_OF]: dmc.pageIdOf,
  [constants.DMC_NAME]: dmc.name,
  [constants.DMC_DASHBOARD]: dmc.dashboard,
  [constants.DMC_MANAGE]: dmc.manage,
  [constants.DRAWERS]: drawers.all,
  [constants.ENDPOINTS]: endpoints.all,
  [constants.ENDPOINTS_COUNT]: endpoints.count,
  [constants.ENDPOINTS_WITHOUT_TOKEN]: endpoints.allWithoutToken,
  [constants.ENDPOINTS_ONE]: endpoints.one,
  [constants.ENDPOINTS_ONE_BY_URL]: endpoints.oneByURL,
  [constants.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT]: layout.componentsGridColumnCount,
  [constants.LOCATION]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MENU_ENABLED]: menu.enabled,
  [constants.MODALS]: modals.all,
  [constants.OAS_CLIENT]: oas.client,
  [constants.OAS_SPEC]: oas.spec,
  [constants.OAS_ORIGINAL_SPEC]: oas.originalSpec,
  [constants.OAS_APIS]: oas.apis,
  [constants.OAS_FLAT_APIS]: oas.flatApis,
  [constants.OAS_API]: oas.api,
  [constants.OAS_API_BY_PATH_AND_METHOD]: oas.apiByPathAndMethod,
  [constants.OAS_PATH_ITEM_OBJECT]: oas.pathItemObject,
  [constants.OAS_OPERATION_OBJECT]: oas.operationObject,
  [constants.OAS_OPERATION_ID]: oas.operationId,
  [constants.OAS_PARAMETER_OBJECTS]: oas.parameterObjects,
  [constants.OAS_RESPONSE_OBJECT]: oas.responseObject,
  [constants.OAS_SCHEMA_OBJECT]: oas.schemaObject,
  [constants.PAGE]: page.all,
  [constants.PAGE_ID]: page.id,
  [constants.PAGE_NAME]: page.name,
  [constants.PAGE_COMPONENTS]: page.components,
  [constants.PAGE_COMPONENTS_COUNT]: page.componentsCount,
  [constants.TOASTS]: toasts.all,
  [constants.UA]: ua.all
};

export {
  constants
};
