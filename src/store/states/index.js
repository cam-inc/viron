import application from './application';
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
  VIRON: 'VIRON',
  OAS: 'OAS',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  LAYOUT: 'LAYOUT',
  LOCATION: 'LOCATION',
  MODALS: 'MODALS',
  PAGE: 'PAGE',
  SIGNIN_SHOW_KEY: 'SIGNIN_SHOW_KEY',
  TOASTS: 'TOASTS',
  UA: 'UA'
};

export default {
  application,
  components,
  current,
  viron,
  oas,
  drawers,
  endpoints,
  layout,
  location,
  modals,
  page,
  signinShowKey,
  toasts,
  ua
};

export {
  constants
};
