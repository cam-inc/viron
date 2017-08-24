import download from 'downloadjs';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.isMenuEnabled = store.getter(getters.MENU_ENABLED);
  this.isMenuOpened = store.getter(getters.MENU_OPENED);

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.listen(states.MENU, () => {
    this.isMenuEnabled = store.getter(getters.MENU_ENABLED);
    this.isMenuOpened = store.getter(getters.MENU_OPENED);
    this.update();
  });

  this.handleMenuButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MENU_TOGGLE));
  };

  this.handleUploadButtonTap = () => {
    // TODO
  };

  this.handleDownloadButtonTap = () => {
    const endpoints = ObjectAssign({}, store.getter(getters.ENDPOINTS));
    // 認証用トークンはexport対象外とする。
    forOwn(endpoints, endpoint => {
      delete endpoint.token;
    });
    download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
  };

  this.handleHomeButtonTap = () => {
    this.getRouter().navigateTo('/');
  };
}
