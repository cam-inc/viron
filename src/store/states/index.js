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
import signinShowKey from './signinShowKey';
import toasts from './toasts';

const constants = {
  APPLICATION: 'APPLICATION',
  COMPONENTS: 'COMPONENTS',
  COMPONENTS_ONE: riotId => {
    return `component_${riotId}`;
  },
  CURRENT: 'CURRENT',
  DMC: 'DMC',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  LOCATION: 'LOCATION',
  MENU: 'MENU',
  MODALS: 'MODALS',
  OAUTH_ENDPOINT_KEY: 'OAUTH_ENDPOINT_KEY',
  PAGE: 'PAGE',
  SIGNIN_SHOW_KEY: 'SIGNIN_SHOW_KEY',
  TOASTS: 'TOASTS'
};

export default {
  application,
  components,
  current,
  dmc,
  drawers,
  endpoints,
  location,
  menu,
  modals,
  oauthEndpointKey,
  page,
  signinShowKey,
  toasts
};

export {
  constants
};
