import constants from '../../core/constants';

import location from './location';
import drawer from './drawer';
import current from './current';
import oauthEndpointKey from './oauthEndpointKey';
import endpoints from './endpoints';
import dmc from './dmc';
import page from './page';
import components from './components';
import toast from './toast';
import modal from './modal';
import auth from './auth';
import authtype from './authtype';


export default {
  [constants.ACTION_LOCATION_SET]: location.set,

  [constants.ACTION_DRAWER_TOGGLE]: drawer.toggle,
  [constants.ACTION_DRAWER_OPEN]: drawer.open,
  [constants.ACTION_DRAWER_CLOSE]: drawer.close,
  [constants.ACTION_DRAWER_ENABLE]: drawer.enable,
  [constants.ACTION_DRAWER_DISABLE]: drawer.disable,

  [constants.ACTION_DMC_GET]: dmc.get,
  [constants.ACTION_DMC_REMOVE]: dmc.remove,

  [constants.ACTION_ENDPOINTS_GET]: endpoints.get,
  [constants.ACTION_ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.ACTION_ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.ACTION_ENDPOINTS_ADD]: endpoints.add,

  [constants.ACTION_CURRENT_UPDATE]: current.update,
  [constants.ACTION_CURRENT_REMOVE]: current.remove,

  [constants.ACTION_OAUTHENDPOINTKEY_UPDATE]: oauthEndpointKey.update,
  [constants.ACTION_OAUTHENDPOINTKEY_REMOVE]: oauthEndpointKey.remove,

  [constants.ACTION_PAGE_GET]: page.get,
  [constants.ACTION_PAGE_REMOVE]: page.remove,

  [constants.ACTION_COMPONENTS_GET]: components.get,
  [constants.ACTION_COMPONENTS_OPERATE]: components.operate,
  [constants.ACTION_COMPONENTS_REMOVE_ALL]: components.removeAll,

  [constants.ACTION_TOAST_SHOW]: toast.show,
  [constants.ACTION_TOAST_HIDE]: toast.hide,

  [constants.ACTION_MODAL_SHOW]: modal.show,
  [constants.ACTION_MODAL_HIDE]: modal.hide,

  [constants.ACTION_AUTH_UPDATE]: auth.update,
  [constants.ACTION_AUTH_REMOVE]: auth.remove,
  [constants.ACTION_AUTH_VALIDATE]: auth.validate,
  [constants.ACTION_AUTH_SIGN_IN_OAUTH]: auth.signInOAuth,
  [constants.ACTION_AUTH_SIGN_IN_EMAIL]: auth.signInEMail,
  [constants.ACTION_AUTH_SIGN_IN_SHOW]: auth.signInShow,

  [constants.ACTION_AUTHTYPE_GET]: authtype.get

};
