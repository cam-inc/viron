viron-components-page.ComponentsPage
  // グラフ系コンポーネントはページ上部に表示する
  .ComponentsPage__graphs
  // number等の小型コンポーネントはページ上部に表示する
  viron-components-page-inlines
  // テーブル型コンポーネントはページ上部に表示する
  .ComponentsPage__tables


  script.
    import './inlines/index.tag';
    import script from './index';
    this.external(script);
