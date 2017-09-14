import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../atoms/viron-message/index.tag';
import './edit.tag';
import './qrcode.tag';
import './signin.tag';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(getters.ENDPOINTS_BY_ORDER_FILTERED);
  this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);
  this.endpointFilterText = store.getter(getters.APPLICATION_ENDPOINT_FILTER_TEXT);

  this.listen(states.ENDPOINTS, () => {
    this.endpoints = store.getter(getters.ENDPOINTS_BY_ORDER_FILTERED);
    this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);
    this.update();
  });

  this.listen(states.APPLICATION, () => {
    this.endpoints = store.getter(getters.ENDPOINTS_BY_ORDER_FILTERED);
    this.endpointFilterText = store.getter(getters.APPLICATION_ENDPOINT_FILTER_TEXT);
    this.update();
  });

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
        return Promise
          .resolve()
          .then(() => store.action(actions.AUTH_GET_TYPES, key))
          .then(authtypes => store.action(actions.MODALS_ADD, 'viron-endpoint-signin', {
            key,
            endpoint: store.getter(getters.ENDPOINTS_ONE, key),
            authtypes,
            onSignin: () => {
              this.getRouter().navigateTo(`/${key}`);
            }
          }));
      })
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointEdit = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'viron-endpoint-edit', {
        endpointKey: key,
        endpoint: store.getter(getters.ENDPOINTS_ONE, key)
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointRemove = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_REMOVE, key))
      .then(() => store.action(actions.TOASTS_ADD, {
        message: 'エンドポイントを削除しました。'
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointQrCode = key => {
    const endpoint = store.getter(getters.ENDPOINTS_ONE, key);
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'viron-endpoint-qrcode', {
        endpoint
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleEndpointLogout = key => {
    Promise
      .resolve()
      .then(() => store.action(actions.AUTH_REMOVE, key))
      .then(() => store.action(actions.TOASTS_ADD, {
        message: 'エンドポイントからログアウトしました。'
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
}
