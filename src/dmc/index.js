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
    const inputFile = e.target;
    const file = inputFile.files[0];

    // ファイルを取得出来たか。
    if (isUndefined(file)) {
      inputFile.value = '';
      return;
    }

    // ファイルがjsonであるか
    if (file.type !== 'application/json') {
      store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加 失敗',
        message: 'JSONファイルを指定してください。',
        error: {}
      });
      inputFile.value = '';
      return;
    }

    // ファイルをテキストとして読み込む。
    const reader = new FileReader();
    reader.readAsText(file);

    // 読み込みが失敗した。
    reader.onerror = () => {
      store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'エンドポイント追加 失敗',
        message: 'ファイルの読み込みに失敗しました。',
        error: {}
      });
      inputFile.value = '';
      return;
    };

    // 読み込みが成功し、完了した。
    reader.onload = event => {
      const text = event.target.result;

      // エンドポイント追加処理開始
      new Promise((resolve, reject) => {
        // ファイルを解析し、エンドポイントの値が正常か確認する。

        // テキストをパース
        const endpoints = JSON.parse(text);
          
        // 値が正常か確認する。
        forOwn(endpoints, val => {
          if (!isValidEndpoint(val)) {
            // 一度でも正しくないファイルがあれば処理を中止する。
            reject('error');
          }
        });
        
        // 正常であれば次の処理へ移行する
        resolve(endpoints);
      })
        .then(() => {
          // エンドポイントをストアへ追加する。
          const endpoints = JSON.parse(text);

          // エンドポインツを配列にする。
          let endpointsArray = [];
          forOwn(endpoints, val => {
            endpointsArray.push(val);
          });

          // エンドポイントをStoreへ追加する。
          return Promise.all(endpointsArray.map( endpoint => {
            return addEndpoint(endpoint);
          }))
          .then(() => store.action(actions.MODALS_ADD, 'dmc-message', {
            title: 'エンドポイント追加',
            message: 'エンドポイントが一覧に追加されました。'
          }));
        })
        .catch(err => {
          store.action(actions.MODALS_ADD, 'dmc-message', {
            title: 'エンドポイント追加 失敗',
            message: 'エンドポイントを追加出来ませんでした。',
            error: err
          });
        });

      // inputしたjsonをリセットする。
      inputFile.value = '';
    };
  };

  /**
   * 対象のエンドポイントに正しく値が入っているか判定します。
   * @param {Object} endpoint 
   * @returns {Boolean}
   */
  const isValidEndpoint = (endpoint) => {
    const keys = ['url', 'memo', 'title', 'name', 'description', 'version', 'color', 'thumbnail', 'tags'];
    let hasOwnAll = true;
    forEach(keys, key => {
      if (!hasOwn(endpoint, key)) {
        hasOwnAll = false;
      }
    });
    return hasOwnAll;
  };

  /**
   * エンドポイントをエンドポイント一覧へ追加します。
   * @param {Object} endpoint
   * @return {Promise}
   */
  const addEndpoint = endpoint => {
    return store.action(actions.ENDPOINTS_MERGE_ONE_WITH_KEY, endpoint);
  };
}
