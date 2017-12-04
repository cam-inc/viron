viron-components-page-search.ComponentsPage_Search
  .ComponentsPage_Search__title 検索
  .ComponentsPage_Search__description クエリパラメータを指定して下さい。
  .ComponentsPage_Search__body
    viron-parameters(val="{ val }" parameterObjects="{ opts.parameterObjects }" onChange="{ handleParametersChange }")
  .ComponentsPage_Search__tail
    viron-button(label="検索する" onSelect="{ handleSearchButtonTap }")

  script.
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-parameters/index.tag';
    import script from './index';
    this.external(script);
