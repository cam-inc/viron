import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../atoms/dmc-message/index.tag';
import './entry.tag';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(getters.ENDPOINTS);

  // TODO: riotx update後に修正すること。
  this.on('mount', () => {
    store.change(states.ENDPOINTS, this.handleEndpointsStateChange);
  }).on('unmount', () => {
    store.off(states.ENDPOINTS, this.handleEndpointsStateChange);
  });

  this.handleEndpointsStateChange = () => {
    this.endpoints = store.getter(getters.ENDPOINTS);
    this.update();
  };

  this.handleEndpointAddTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-entry'))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleEndpointEntry = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.AUTH_VALIDATE, key))
      .then(isValid => {
        // tokenが有効ならばendpointページに遷移させる。
        // 無効ならサインイン用のモーダルを表示させる。
        if (isValid) {
          this.getRouter().navigateTo(`/${key}`);
          return Promise.resolve();
        }
        // TODO: サインインモーダルを表示すること。
        return store.action(actions.MODALS_ADD, 'dmc-message');
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleEndpointEdit = () => {
    // TODO:
  };

  this.handleEndpointRemove = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_REMOVE, key))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleEndpointLogout = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.AUTH_REMOVE, key))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };
}
