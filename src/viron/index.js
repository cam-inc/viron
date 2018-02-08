import throttle from 'mout/function/throttle';

export default function() {
  const store = this.riotx.get();

  this.isLaunched = store.getter('application.isLaunched');
  this.isNavigating = store.getter('application.isNavigating');
  this.isNetworking = store.getter('application.isNetworking');
  this.theme = store.getter('viron.theme');
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
    // ページ遷移が完了した時のみscrollを発火させる。
    if (this.isNavigating && !store.getter('application.isNavigating')) {
      this.refs.main.scrollTop = 0;
    }
    this.isNavigating = store.getter('application.isNavigating');
    this.isNetworking = store.getter('application.isNetworking');
    this.endpointFilterText = store.getter('application.endpointFilterText');
    this.isAsideClosed = (!store.getter('location.isTop') && !store.getter('application.isMenuOpened'));
    this.update();
  });
  this.listen('viron', () => {
    this.theme = store.getter('viron.theme');
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
}
