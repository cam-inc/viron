export default {
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
  endpointFilterText: ''
};
