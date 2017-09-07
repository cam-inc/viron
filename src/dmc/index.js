import download from 'downloadjs';
import { constants as actions } from '../store/actions';
import { constants as getters } from '../store/getters';
import { constants as states } from '../store/states';
import '../components/atoms/dmc-message/index.tag';
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
      .then(() => store.action(actions.MODALS_ADD, 'dmc-entry'))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        error: err
      }));
  };

  this.handleDownloadMenuItemTap = () => {
    const endpoints = store.getter(getters.ENDPOINTS_WITHOUT_TOKEN);
    download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
  };

  this.handleFileChange = e =>{
    const inputFile = e.target;
    const file = inputFile.files[0];

    // ファイルを取得出来たか。
    if (!file) {
      inputFile.value = null;
      return;
    }

    // ファイルがjsonであるか
    if (file.type !== 'application/json') {
      store.action(actions.MODALS_ADD, 'dmc-message', {
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
      store.action(actions.MODALS_ADD, 'dmc-message', {
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
        .then(() => store.action(actions.MODALS_ADD, 'dmc-message', {
          title: 'エンドポイント追加',
          message: 'エンドポイントが一覧に追加されました。'
        }))
        .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
            title: 'エンドポイント追加 失敗',
            error: err
          }));
      // inputしたjsonをリセットする。
      inputFile.value = null;
    };
  };
}
