import application from './application';
import components from './components';
import current from './current';
import dmc from './dmc';
import drawers from './drawers';
import endpoints from './endpoints';
import location from './location';
import menu from './menu';
import modals from './modals';
import oauthEndpointKey from './oauthEndpointKey';
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
  COMPONENTS_ONE_SCHEMA: 'COMPONENTS_ONE_SCHEMA',
  COMPONENTS_ONE_SELF_ACTIONS: 'COMPONENTS_ONE_SELF_ACTIONS',
  COMPONENTS_ONE_ROW_ACTIONS: 'COMPONENTS_ONE_ROW_ACTIONS',
  COMPONENTS_ONE_TABLE_LABELS: 'COMPONENTS_ONE_TABLE_LABELS',
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  DMC_PAGES: 'DMC_PAGES',
  DMC_PAGES_ID_OF: 'DMC_PAGES_ID_OF',
  DMC_NAME: 'DMC_NAME',
  DMC_DASHBOARD: 'DMC_DASHBOARD',
  DMC_MANAGE: 'DMC_MANAGE',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  ENDPOINTS_ONE: 'ENDPOINTS_ONE',
  ENDPOINTS_ONE_BY_URL: 'ENDPOINTS_ONE_BY_URL',
  LOCATION: 'LOCATION',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MENU_OPENED: 'MENU_OPENED',
  MENU_ENABLED: 'MENU_ENABLED',
  MODALS: 'MODALS',
  OAUTH_ENDPOINT_KEY: 'OAUTH_ENDPOINT_KEY',
  PAGE: 'PAGE',
  PAGE_ID: 'PAGE_ID',
  PAGE_NAME: 'PAGE_NAME',
  PAGE_COMPONENTS: 'PAGE_COMPONENTS',
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
  [constants.COMPONENTS_ONE_SCHEMA]: components.schema,
  [constants.COMPONENTS_ONE_SELF_ACTIONS]: components.selfActions,
  [constants.COMPONENTS_ONE_ROW_ACTIONS]: components.rowActions,
  [constants.COMPONENTS_ONE_TABLE_LABELS]: components.tableLabels,
  [constants.CURRENT]: current.all,
  [constants.DMC]: dmc.all,
  [constants.DMC_PAGES]: dmc.pages,
  [constants.DMC_PAGES_ID_OF]: dmc.pageIdOf,
  [constants.DMC_NAME]: dmc.name,
  [constants.DMC_DASHBOARD]: dmc.dashboard,
  [constants.DMC_MANAGE]: dmc.manage,
  [constants.DRAWERS]: drawers.all,
  [constants.ENDPOINTS]: endpoints.all,
  [constants.ENDPOINTS_ONE]: endpoints.one,
  [constants.ENDPOINTS_ONE_BY_URL]: endpoints.oneByURL,
  [constants.LOCATION]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MENU_OPENED]: menu.opened,
  [constants.MENU_ENABLED]: menu.enabled,
  [constants.MODALS]: modals.all,
  [constants.OAUTH_ENDPOINT_KEY]: oauthEndpointKey.all,
  [constants.PAGE]: page.all,
  [constants.PAGE_ID]: page.id,
  [constants.PAGE_NAME]: page.name,
  [constants.PAGE_COMPONENTS]: page.components,
  [constants.TOASTS]: toasts.all,
  [constants.UA]: ua.all
};

export {
  constants
};
