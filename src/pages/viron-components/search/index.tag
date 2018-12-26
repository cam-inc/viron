viron-components-page-search.ComponentsPage_Search(class="ComponentsPage_Search--{ layoutType }")
  .ComponentsPage_Search__head
    .ComponentsPage_Search__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close
    .ComponentsPage_Search__title { i18n('pg.components.search.title') }
    .ComponentsPage_Search__description { i18n('pg.components.search.description') }。
  .ComponentsPage_Search__body
    viron-parameters(val="{ val }" theme="ghost" parameterObjects="{ opts.parameterObjects }" onChange="{ handleParametersChange }")
  .ComponentsPage_Search__tail
    viron-button(label="{ i18n('pg.components.search.button') }" onSelect="{ handleSearchButtonTap }")

  script.
    import '../../../components/icons/viron-icon-close/index.tag';
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-parameters/index.tag';
    import script from './index';
    this.external(script);
