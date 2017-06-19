import current from './current';
import dmc from './dmc';
import drawers from './drawers';
import endpoints from './endpoints';
import location from './location';
import menu from './menu';
import modals from './modals';
import toasts from './toasts';

const constants = {
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  DMC_PAGES: 'DMC_PAGES',
  DMC_NAME: 'DMC_NAME',
  DMC_DASHBOARD: 'DMC_DASHBOARD',
  DMC_MANAGE: 'DMC_MANAGE',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  ENDPOINTS_ONE: 'ENDPOINTS_ONE',
  ENDPOINTS_ONE_BY_URL: 'ENDPOINTS_ONE_BY_URL',
  ENDPOINTS_NEXT_KEY: 'ENDPOINTS_NEXT_KEY',
  LOCATION_ALL: 'LOCATION_ALL',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MENU_OPENED: 'MENU_OPENED',
  MENU_ENABLED: 'MENU_ENABLED',
  MODALS: 'MODALS',
  TOASTS: 'TOASTS'
};

export default {
  [constants.CURRENT]: current.all,
  [constants.DMC]: dmc.all,
  [constants.DMC_PAGES]: dmc.pages,
  [constants.DMC_NAME]: dmc.name,
  [constants.DMC_DASHBOARD]: dmc.dashboard,
  [constants.DMC_MANAGE]: dmc.manage,
  [constants.DRAWERS]: drawers.all,
  [constants.ENDPOINTS]: endpoints.all,
  [constants.ENDPOINTS_ONE]: endpoints.one,
  [constants.ENDPOINTS_ONE_BY_URL]: endpoints.oneByURL,
  [constants.ENDPOINTS_NEXT_KEY]: endpoints.nextKey,
  [constants.LOCATION_ALL]: location.all,
  [constants.LOCATION_NAME]: location.name,
  [constants.LOCATION_ROUTE]: location.route,
  [constants.MENU_OPENED]: menu.opened,
  [constants.MENU_ENABLED]: menu.enabled,
  [constants.MODALS]: modals.all,
  [constants.TOASTS]: toasts.all
};

export {
  constants
};
