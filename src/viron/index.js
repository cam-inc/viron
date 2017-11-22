import download from 'downloadjs';
import throttle from 'mout/function/throttle';
import '../components/atoms/viron-message/index.tag';
import './confirm.tag';
import './entry.tag';
import './order.tag';

export default function() {
  const store = this.riotx.get();

  this.isLaunched = store.getter('application.isLaunched');
  this.isNavigating = store.getter('application.isNavigating');
  this.isNetworking = store.getter('application.isNetworking');
  // 表示すべきページの名前。
  this.pageName = store.getter('location.name');
  // TOPページか否か。
  this.isTopPage = store.getter('location.isTop');
  // 表示すべきページのルーティング情報。
  this.pageRoute = store.getter('location.route');
  // エンドポイント数。
  this.endpointsCount = store.getter('endpoints.one');
  // エンドポイントフィルター用のテキスト。
  this.endpointFilterText = store.getter('application.endpointFilterText');
  // バグに対処するため、ブラウザ毎クラス設定目的でブラウザ名を取得する。
  this.usingBrowser = store.getter('ua.usingBrowser');
  // レスポンシブデザイン用。
  this.layoutType = store.getter('layout.type');
  this.isDesktop = store.getter('layout.isDesktop');
  this.isMobile = store.getter('layout.isMobile');
  // 左カラムの開閉状態。トップページでは常にopenとなる。
  this.isAsideClosed = (!store.getter('location.isTop') && !store.getter('application.isMenuOpened'));

  this.listen('application', () => {
    this.isLaunched = store.getter('application.isLaunched');
    this.isNavigating = store.getter('application.isNavigating');
    this.isNetworking = store.getter('application.isNetworking');
    this.endpointFilterText = store.getter('application.endpointFilterText');
    this.isAsideClosed = (!store.getter('location.isTop') && !store.getter('application.isMenuOpened'));
    this.update();
  });
  this.listen('location', () => {
    this.pageName = store.getter('location.name');
    this.isTopPage = store.getter('location.isTop');
    this.pageRoute = store.getter('location.route');
    this.isAsideClosed = (!store.getter('location.isTop') && !store.getter('application.isMenuOpened'));
    this.update();
  });
  this.listen('endpoints', () => {
    this.endpointsCount = store.getter('endpoints.count');
    this.update();
  });
  this.listen('ua', () => {
    this.usingBrowser = store.getter('ua.usingBrowser');
    this.update();
  });
  this.listen('layout', () => {
    this.layoutType = store.getter('layout.type');
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });

  // resize時にvironアプリケーションの表示サイズを更新します。
  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    store.action('layout.updateSize', width, height);
  }, 1000);
  this.on('mount', () => {
    window.addEventListener('resize', handleResize);
  }).on('unmount', () => {
    window.removeEventListener('resize', handleResize);
  });

  this.handleEntryMenuItemClick = () => {
    Promise
      .resolve()
      .then(() => store.action('modals.add', 'viron-application-entry'))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleDownloadMenuItemClick = () => {
    const endpoints = store.getter('endpoints.allWithoutToken');
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
    if (!store.getter('ua.isEdge') && file.type !== 'application/json') {
      store.action('modals.add', 'viron-message', {
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
      store.action('modals.add', 'viron-message', {
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
          return store.action('endpoints.mergeAll', endpoints);
        })
        .then(() => store.action('modals.add', 'viron-message', {
          title: 'エンドポイント追加',
          message: 'エンドポイントが一覧に追加されました。'
        }))
        .catch(err => store.action('modals.add', 'viron-message', {
          title: 'エンドポイント追加 失敗',
          error: err
        }));
      // inputしたjsonをリセットする。
      inputFile.value = null;
    };
  };

  this.handleOrderMenuItemClick = () => {
    store.action('modals.add', 'viron-application-order');
  };

  this.handleClearMenuItemClick = () => {
    Promise
      .resolve()
      .then(() => store.action('modals.add', 'viron-application-confirm', {
        onConfirm: () => {
          store.action('endpoints.removeAll');
        }
      }))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };

  this.handleFilterChange = newText => {
    Promise
      .resolve()
      .then(() => store.action('application.updateEndpointFilterText', newText))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };
}
