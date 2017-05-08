import constants from '../../core/constants';

import drawer from './drawer';
import current from './current';
import endpoint from './endpoint';
import dmc from './dmc';
import page from './page';
import component from './component';
import toast from './toast';
import modal from './modal';
import auth from './auth';
import authtype from './authtype';


export default {
  [constants.ACTION_DRAWER_TOGGLE]: drawer.toggle,
  [constants.ACTION_DRAWER_CLOSE]: drawer.close,

  [constants.ACTION_DMC_GET]: dmc.show,
  [constants.ACTION_DMC_REMOVE]: dmc.remove,

  [constants.ACTION_ENDPOINT_GET]: endpoint.get,
  [constants.ACTION_ENDPOINT_REMOVE]: endpoint.remove,
  [constants.ACTION_ENDPOINT_REMOVE_ALL]: endpoint.removeAll,
  [constants.ACTION_ENDPOINT_ADD]: endpoint.add,

  [constants.ACTION_CURRENT_UPDATE]: current.update,
  [constants.ACTION_CURRENT_REMOVE]: current.remove,

  [constants.ACTION_PAGE_GET]: page.show,

  [constants.ACTION_COMPONENT_GET]: component.show,

  [constants.ACTION_TOAST_SHOW]: toast.show,
  [constants.ACTION_TOAST_HIDE]: toast.hide,

  [constants.ACTION_MODAL_SHOW]: modal.show,
  [constants.ACTION_MODAL_HIDE]: modal.hide,

  [constants.ACTION_AUTH_UPDATE]: auth.update,
  [constants.ACTION_AUTH_SIGN_IN_GOOGLE]: auth.signInGoogle,
  [constants.ACTION_AUTH_SIGN_IN_EMAIL]: auth.signInEMail,
  [constants.ACTION_AUTH_SIGN_IN_SHOW]: auth.signInShow,

  [constants.ACTION_AUTHTYPE_GET]: authtype.get,

};
