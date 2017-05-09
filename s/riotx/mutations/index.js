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

export default {
  [constants.MUTATION_DRAWER_TOGGLE]: drawer.toggle,
  [constants.MUTATION_DRAWER_OPEN]: drawer.open,
  [constants.MUTATION_DRAWER_CLOSE]: drawer.close,
  [constants.MUTATION_DRAWER_ENABLE]: drawer.enable,
  [constants.MUTATION_DRAWER_DISABLE]: drawer.disable,

  [constants.MUTATION_DMC]: dmc.show,
  [constants.MUTATION_DMC_REMOVE]: dmc.remove,

  [constants.MUTATION_ENDPOINT]: endpoint.show,
  [constants.MUTATION_ENDPOINT_REMOVE]: endpoint.remove,
  [constants.MUTATION_ENDPOINT_REMOVE_ALL]: endpoint.removeAll,
  [constants.MUTATION_ENDPOINT_ADD]: endpoint.add,
  [constants.MUTATION_ENDPOINT_UPDATE]: endpoint.update,

  [constants.MUTATION_CURRENT_UPDATE]: current.update,
  [constants.MUTATION_CURRENT_REMOVE]: current.remove,

  [constants.MUTATION_PAGE]: page.show,

  [constants.MUTATION_COMPONENT_ONE]: component.one,

  [constants.MUTATION_TOAST_ADD]: toast.add,
  [constants.MUTATION_TOAST_REMOVE]: toast.remove,

  [constants.MUTATION_MODAL_ADD]: modal.add,
  [constants.MUTATION_MODAL_REMOVE]: modal.remove,

  [constants.MUTATION_ENDPOINT_TOKEN_UPDATE]: endpoint.updateToken,

  [constants.MUTATION_AUTH_SIGN_IN_SHOW]: auth.signInShow,
};
