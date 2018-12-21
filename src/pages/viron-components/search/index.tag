viron-components-page-search.ComponentsPage_Search(class="ComponentsPage_Search--{ layoutType }")
  .ComponentsPage_Search__head
    .ComponentsPage_Search__closeButton(onTap="{ handleCloseButtonTap }")
      viron-icon-close
    .ComponentsPage_Search__title { i18n('viron_components_search_title') }
    .ComponentsPage_Search__description { i18n('viron_components_search_description') }。
  .ComponentsPage_Search__body
    viron-parameters(val="{ val }" theme="ghost" parameterObjects="{ opts.parameterObjects }" onChange="{ handleParametersChange }")
  .ComponentsPage_Search__tail
    viron-button(label="{ i18n('viron_components_search_button') }" onSelect="{ handleSearchButtonTap }")

  script.
    import '../../../components/icons/viron-icon-close/index.tag';
    import '../../../components/viron-button/index.tag';
    import '../../../components/viron-parameters/index.tag';
    import script from './index';
    this.external(script);
