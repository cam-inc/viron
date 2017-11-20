viron-components-page.ComponentsPage
  .ComponentsPage__name { name }
  // グラフ系コンポーネントはページ上部に表示する
  .ComponentsPage__graphs
  // number等の小型コンポーネントはページ上部に表示する
  .ComponentsPage__inlines
    viron-components-page-inlines
  // テーブル型コンポーネントはページ上部に表示する
  .ComponentsPage__tables
    viron-components-page-tables


  script.
    import './inlines/index.tag';
    import './tables/index.tag';
    import script from './index';
    this.external(script);
