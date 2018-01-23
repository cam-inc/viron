import ObjectAssign from 'object-assign';
import application from './application';
import components from './components';
import current from './current';
import drawers from './drawers';
import endpoints from './endpoints';
import layout from './layout';
import location from './location';
import mediapreviews from './mediapreviews';
import modals from './modals';
import oas from './oas';
import page from './page';
import popovers from './popovers';
import signinShowKey from './signinShowKey';
import toasts from './toasts';
import ua from './ua';
import util from './util';
import viron from './viron';

export default ObjectAssign(
  {},
  application,
  components,
  current,
  drawers,
  endpoints,
  layout,
  location,
  mediapreviews,
  modals,
  oas,
  page,
  popovers,
  signinShowKey,
  toasts,
  ua,
  util,
  viron
);

const getComponentStateName = riotId => {
  return `component_${riotId}`;
};

export {
  getComponentStateName
};
