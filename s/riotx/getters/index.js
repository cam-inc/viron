import constants from '../../core/constants';

import location from './location';
import menu from './menu';
import dmc from './dmc';
import current from './current';
import oauthEndpointKey from './oauthEndpointKey';
import page from './page';
import components from './components';
import toast from './toast';
import modal from './modal';
import drawer from './drawer';
import endpoints from './endpoints';
import auth from './auth';

export default {
  [constants.GETTER_LOCATION]: location._,
  [constants.GETTER_LOCATION_TAG]: location.tag,
  [constants.GETTER_LOCATION_DMCPAGE]: location.dmcPage,

  [constants.GETTER_MENU_OPENED]: menu.opened,
  [constants.GETTER_MENU_ENABLED]: menu.enabled,

  [constants.GETTER_DMC]: dmc._,
  [constants.GETTER_DMC_PAGES]: dmc.pages,
  [constants.GETTER_DMC_NAME]: dmc.name,
  [constants.GETTER_DMC_DASHBOARD]: dmc.dashboard,
  [constants.GETTER_DMC_MANAGE]: dmc.manage,

  [constants.GETTER_CURRENT]: current._,

  [constants.GETTER_OAUTHENDPOINTKEY]: oauthEndpointKey._,

  [constants.GETTER_PAGE]: page._,
  [constants.GETTER_PAGE_NAME]: page.name,
  [constants.GETTER_PAGE_COMPONENTS]: page.components,

  [constants.GETTER_COMPONENTS_ONE]: components.one,

  [constants.GETTER_TOAST_LIST]: toast.list,

  [constants.GETTER_MODAL_LIST]: modal.list,

  [constants.GETTER_DRAWER_LIST]: drawer.list,

  [constants.GETTER_ENDPOINTS]: endpoints._,
  [constants.GETTER_ENDPOINTS_ONE]: endpoints.one,
  [constants.GETTER_ENDPOINTS_NEXT_KEY]: endpoints.nextKey,

  [constants.GETTER_AUTH_SIGN_IN_SHOW_KEY]: auth.signinShowKey

};
