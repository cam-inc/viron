import download from 'downloadjs';
import isUndefined from 'mout/lang/isUndefined';
import forOwn from 'mout/Object/forOwn';
import hasOwn from 'mout/Object/hasOwn';
import forEach from 'mout/array/forEach';
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
    const file = e.target.files[0];
    const reader = new FileReader();

    // ファイルを取得出来たか。
    if (isUndefined(file)) {
      return;
    }

    // ファイルがJSONでないか。
    if (file.type !== 'application/json') {
      store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加 失敗',
        message: 'ファイルはjsonを選択してください。',
        error: {}
      });
      return;
    }

    // ファイルをテキストとして読み込む。
    reader.readAsText(file);

    // 読み込みが成功して完了した。
    reader.onload = () => {
      parseFile(event.target.result);
    };
  };

  /**
   * ファイルをパースし、エンドポイントへ追加します。
   * @param {String} text 
   */
  const parseFile = file => {
    Promise
      .resolve()
      .then(() => {
        // JSONにパースする。
        const endpoints = JSON.parse(file);

        // エンドポイントを配列にする。
        const endpointsArray = [];
        forOwn(endpoints, val => {
          endpointsArray.push(val);
        });

        // 成功したときの表示オブジェクト。
        const success = {
          title: 'エンドポイント追加',
          message: 'エンドポイントが一覧に追加されました。'
        };

        // 失敗したときの表示オブジェクト。
        const failure = {
          title: 'エンドポイント追加 失敗',
          message: 'エンドポイントを追加出来ませんでした。',
          error: {}
        };

        // 並行処理を行う。
        Promise.all(endpointsArray.map( endpoint => {
          return addEndpoint(endpoint);
        }))
        .then(() => store.action(actions.MODALS_ADD, 'dmc-message', success))
        .catch(() => store.action(actions.MODALS_ADD, 'dmc-message', failure));
      })
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加 失敗',
        message: 'エンドポイントを追加出来ませんでした。',
        error: err
      }));
  };

  const addEndpoint = endpoint => {
    return new Promise((resolve, reject) => {
      let hasAllKeys = true;
      const keys = ['url', 'memo', 'title', 'name', 'description', 'version', 'color', 'thumbnail', 'tags'];
      forEach(keys, key => {
        if (!hasOwn(endpoint, key)) {
          hasAllKeys = false;
        }
      });

      if (hasAllKeys) {
        store.action(actions.ENDPOINTS_MERGE_ONE_WITH_KEY, endpoint);
        console.log('resolve');
        resolve();
      } else {
        console.log('reject');
        reject();
      }
    });
  };
}
