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
import oauthEndpointKey from './oauthEndpointKey';
import page from './page';
import signinShowKey from './signinShowKey';
import toasts from './toasts';
import ua from './ua';

const constants = {
  APPLICATION: 'APPLICATION',
  COMPONENTS: 'COMPONENTS',
  COMPONENTS_ONE: riotId => {
    return `component_${riotId}`;
  },
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  OAS: 'OAS',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  LAYOUT: 'LAYOUT',
  LOCATION: 'LOCATION',
  MENU: 'MENU',
  MODALS: 'MODALS',
  OAUTH_ENDPOINT_KEY: 'OAUTH_ENDPOINT_KEY',
  PAGE: 'PAGE',
  SIGNIN_SHOW_KEY: 'SIGNIN_SHOW_KEY',
  TOASTS: 'TOASTS',
  UA: 'UA'
};

export default {
  application,
  components,
  current,
  dmc,
  oas,
  drawers,
  endpoints,
  layout,
  location,
  menu,
  modals,
  oauthEndpointKey,
  page,
  signinShowKey,
  toasts,
  ua
};

export {
  constants
};
