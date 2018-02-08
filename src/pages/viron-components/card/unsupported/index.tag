viron-components-page-unsupported.ComponentsPage_Card_Unsupported
  .ComponentsPage_Card_Unsupported__head
    .ComponentsPage_Card_Unsupported__title { opts.def.name }
  .ComponentsPage_Card_Unsupported__body
    .ComponentsPage_Card_Unsupported__error コンポーネントタイプ「{ opts.def.style }」は現在サポートされていません。

  script.
    import script from './index';
    this.external(script);
