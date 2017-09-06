import download from 'downloadjs';
import { constants as actions } from '../store/actions';
import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';
import '../components/atoms/dmc-message/index.tag';
import './confirm.tag';
import './entry.tag';

export default function() {
  const store = this.riotx.get();

  this.isLaunched = store.getter(getters.APPLICATION_ISLAUNCHED);
  this.isNavigating = store.getter(getters.APPLICATION_ISNAVIGATING);
  this.isNetworking = store.getter(getters.APPLICATION_ISNETWORKING);
  // 表示すべきページの名前。
  this.pageName = store.getter(getters.LOCATION_NAME);
  // TOPページか否か。
  this.isTopPage = (this.pageName === 'endpoints');
  // 表示すべきページのルーティング情報。
  this.pageRoute = store.getter(getters.LOCATION_ROUTE);

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.listen(states.APPLICATION, () => {
    this.isLaunched = store.getter(getters.APPLICATION_ISLAUNCHED);
    this.isNavigating = store.getter(getters.APPLICATION_ISNAVIGATING);
    this.isNetworking = store.getter(getters.APPLICATION_ISNETWORKING);
    this.update();
  });
  this.listen(states.LOCATION, () => {
    this.pageName = store.getter(getters.LOCATION_NAME);
    this.isTopPage = (this.pageName === 'endpoints');
    this.pageRoute = store.getter(getters.LOCATION_ROUTE);
    this.update();
  });

  this.handleEntryMenuItemTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-application-entry'))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleDownloadMenuItemTap = () => {
    const endpoints = store.getter(getters.ENDPOINTS_WITHOUT_TOKEN);
    download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
  };

  this.handleClearMenuItemTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-application-confirm', {
        onConfirm: () => {
          store.action(actions.ENDPOINTS_REMOVE_ALL);
        }
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };
}
