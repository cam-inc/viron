import exporter from './exporter';

export default exporter('application', {
  // バージョン。https://cam-inc.github.io/viron/v1/の`v1`部分。
  version: (() => {
    const url = new URL(window.location.href);
    if (url.hostname === 'localhost') {
      return 'local';
    }
    return url.pathname.replace(/viron/, '').replace(/\//g, '');
  })(),
  // vironの最新バージョン。
  latestVersion: 'v1',
  // 起動状態。
  isLaunched: false,
  // 画面遷移中か否か。
  isNavigating: false,
  // 通信中のAPI群。
  networkings: [],
  // 通信中か否か(i.e. 一つでも通信中のAPIが存在するか?)
  isNetworking: false,
  // ドラッグ中か否か。
  isDragging: false,
  // 左カラムメニューの開閉状態
  isMenuOpened: true,
  // エンドポイントページに用いるエンドポイントフィルター用のテキスト。
  endpointFilterText: '',
  // エンドポイントページに用いるエンドポイントフィルター用の確定前テキスト。
  endpointTempFilterText: ''
});
