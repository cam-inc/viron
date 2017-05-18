import constants from '../../core/constants';

import location from './location';
import menu from './menu';
import current from './current';
import oauthEndpointKey from './oauthEndpointKey';
import endpoints from './endpoints';
import dmc from './dmc';
import page from './page';
import components from './components';
import toast from './toast';
import modal from './modal';
import auth from './auth';

export default {
  [constants.MUTATION_LOCATION]: location._,

  [constants.MUTATION_MENU_TOGGLE]: menu.toggle,
  [constants.MUTATION_MENU_OPEN]: menu.open,
  [constants.MUTATION_MENU_CLOSE]: menu.close,
  [constants.MUTATION_MENU_ENABLE]: menu.enable,
  [constants.MUTATION_MENU_DISABLE]: menu.disable,

  [constants.MUTATION_DMC]: dmc.show,
  [constants.MUTATION_DMC_REMOVE]: dmc.remove,

  [constants.MUTATION_ENDPOINTS]: endpoints.show,
  [constants.MUTATION_ENDPOINTS_REMOVE]: endpoints.remove,
  [constants.MUTATION_ENDPOINTS_REMOVE_ALL]: endpoints.removeAll,
  [constants.MUTATION_ENDPOINTS_ADD]: endpoints.add,
  [constants.MUTATION_ENDPOINTS_UPDATE]: endpoints.update,
  [constants.MUTATION_ENDPOINTS_TOKEN_UPDATE]: endpoints.updateToken,

  [constants.MUTATION_CURRENT]: current._,

  [constants.MUTATION_OAUTHENDPOINTKEY]: oauthEndpointKey._,

  [constants.MUTATION_PAGE]: page._,

  [constants.MUTATION_COMPONENTS_ONE]: components.one,
  [constants.MUTATION_COMPONENTS_REMOVE_ALL]: components.removeAll,
  [constants.MUTATION_COMPONENTS_REMOVE_ONE]: components.removeOne,

  [constants.MUTATION_TOAST_ADD]: toast.add,
  [constants.MUTATION_TOAST_REMOVE]: toast.remove,

  [constants.MUTATION_MODAL_ADD]: modal.add,
  [constants.MUTATION_MODAL_REMOVE]: modal.remove,

  [constants.MUTATION_AUTH_SIGN_IN_SHOW]: auth.signInShow
};
