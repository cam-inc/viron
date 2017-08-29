import throttle from 'mout/function/throttle';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';
import '../../atoms/dmc-message/index.tag';
import './edit.tag';
import './qrcode.tag';
import './signin.tag';

export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(getters.ENDPOINTS);
  this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);

  /**
   * 現在のviewportに最適なcolumn数を計算して返します。
   * @return {Number}
   */
  const getGridColumnCountForCurrentViewport = () => {
    const containerWidth = this.refs.list.getBoundingClientRect().width;
    const baseColumnWith = 250;
    const newColumnCount = Math.floor(containerWidth / baseColumnWith) || 1;
    return newColumnCount;
  };

  /**
   * column数を更新します。
   */
  const updateGridColumnCount = () => {
    const columnCount = getGridColumnCountForCurrentViewport();
    store.action(actions.LAYOUT_UPDATE_ENDPOINTS_GRID_COLUMN_COUNT, columnCount);
  };
  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle(updateGridColumnCount, 1000);
  this.on('mount', () => {
    // 初回にcolumn数を設定する。
    updateGridColumnCount();
    window.addEventListener('resize', handleResize);
  }).on('unmount', () => {
    window.removeEventListener('resize', handleResize);
  });

  this.listen(states.LAYOUT, () => {
    const columnCount = store.getter(getters.LAYOUT_ENDPOINTS_GRID_COLUMN_COUNT);
    document.documentElement.style.setProperty('--page-endpoints-grid-column-count', columnCount);
  });
  this.listen(states.ENDPOINTS, () => {
    this.endpoints = store.getter(getters.ENDPOINTS);
    this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);
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
          .then(authtypes => store.action(actions.MODALS_ADD, 'dmc-endpoint-signin', {
            key,
            endpoint: store.getter(getters.ENDPOINTS_ONE, key),
            authtypes,
            onSignin: () => {
              this.getRouter().navigateTo(`/${key}`);
            }
          }));
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleEndpointEdit = (key, url, memo) => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-endpoint-edit', {
        endpointKey: key,
        url,
        memo
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
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
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleEndpointQrCode = (key, url, memo) => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'dmc-endpoint-qrcode', {
        endpointKey: key,
        url,
        memo
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
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
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };
}
