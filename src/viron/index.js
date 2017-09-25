import download from 'downloadjs';
import { constants as actions } from '../store/actions';
import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';
import '../components/atoms/viron-message/index.tag';
import './confirm.tag';
import './entry.tag';
import './order.tag';

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
  // エンドポイント数。
  this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);
  // エンドポイントフィルター用のテキスト。
  this.endpointFilterText = store.getter(getters.APPLICATION_ENDPOINT_FILTER_TEXT);
  // Firefox, Edgeのpaddingバグを回避するため、当該ブラウザのとき、特殊クラスを指定する
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=748518
  this.isExceptionalBrowser = store.getter(getters.UA_IS_FIREFOX) || store.getter(getters.UA_IS_EDGE);

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.listen(states.APPLICATION, () => {
    this.isLaunched = store.getter(getters.APPLICATION_ISLAUNCHED);
    this.isNavigating = store.getter(getters.APPLICATION_ISNAVIGATING);
    this.isNetworking = store.getter(getters.APPLICATION_ISNETWORKING);
    this.endpointFilterText = store.getter(getters.APPLICATION_ENDPOINT_FILTER_TEXT);
    this.update();
  });
  this.listen(states.LOCATION, () => {
    this.pageName = store.getter(getters.LOCATION_NAME);
    this.isTopPage = (this.pageName === 'endpoints');
    this.pageRoute = store.getter(getters.LOCATION_ROUTE);
    this.update();
  });
  this.listen(states.ENDPOINTS, () => {
    this.endpointsCount = store.getter(getters.ENDPOINTS_COUNT);
    this.update();
  });
  this.listen(states.UA, () => {
    this.isExceptionalBrowser = store.getter(getters.UA_IS_FIREFOX) || store.getter(getters.UA_IS_EDGE);
    this.update();
  });

  this.handleEntryMenuItemTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'viron-application-entry'))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleDownloadMenuItemTap = () => {
    const endpoints = store.getter(getters.ENDPOINTS_WITHOUT_TOKEN);
    download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
  };

  this.handleFileChange = e => {
    const inputFile = e.target;
    const file = inputFile.files[0];

    // ファイルを取得出来たか。
    if (!file) {
      inputFile.value = null;
      return;
    }

    // ファイルがjsonであるか
    // Edge v.15環境で`file/type`値が空文字になるため、Edge以外の環境のみtypeチェックを行う。
    if (!store.getter(getters.UA_IS_EDGE) && file.type !== 'application/json') {
      store.action(actions.MODALS_ADD, 'viron-message', {
        title: 'エンドポイント追加 失敗',
        message: 'JSONファイルを指定してください。',
        type: 'error'
      });
      inputFile.value = null;
      return;
    }

    // ファイルをテキストとして読み込む。
    const reader = new FileReader();
    reader.readAsText(file);

    // 読み込みが失敗した。
    reader.onerror = err => {
      store.action(actions.MODALS_ADD, 'viron-message', {
        title: 'エンドポイント追加 失敗',
        message: 'ファイルの読み込みに失敗しました。',
        error: err
      });
      inputFile.value = null;
    };

    // 読み込みが成功し、完了した。
    reader.onload = event => {
      const text = event.target.result;

      // エンドポイント追加処理開始
      Promise
        .resolve()
        .then(() => {
          const endpoints = JSON.parse(text);
          return store.action(actions.ENDPOINTS_MERGE_ALL, endpoints);
        })
        .then(() => store.action(actions.MODALS_ADD, 'viron-message', {
          title: 'エンドポイント追加',
          message: 'エンドポイントが一覧に追加されました。'
        }))
        .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
          title: 'エンドポイント追加 失敗',
          error: err
        }));
      // inputしたjsonをリセットする。
      inputFile.value = null;
    };
  };

  this.handleOrderMenuItemTap = () => {
    store.action(actions.MODALS_ADD, 'viron-application-order');
  };

  this.handleClearMenuItemTap = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.MODALS_ADD, 'viron-application-confirm', {
        onConfirm: () => {
          store.action(actions.ENDPOINTS_REMOVE_ALL);
        }
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleFilterChange = newText => {
    Promise
      .resolve()
      .then(() => store.action(actions.APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT, newText))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
}
