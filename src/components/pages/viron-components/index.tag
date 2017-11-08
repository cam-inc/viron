viron-components.Page.ComponentsPage
  .ComponentsPage__head
    .ComponentsPage__breadcrumb
      .ComponentsPage__breadcrumbIcon
        viron-icon(type="home")
      .ComponentsPage__breadcrumbIcon
        viron-icon(type="right")
      .ComponentsPage__breadcrumbLabel { name } ({ componentsCount })
    .ComponentsPage__control
      .ComponentsPage__search(if="{ componentsCount > 1 && !!getParameterObjectsForSearch().length }" class="{ isCurrentSearchRequestParametersEmpty() ? '' : 'ComponentsPage__search--active' }" onClick="{ handleSearchButtonClick }")
        viron-icon(type="search")
        viron-tooltip(if="{ isSearchTooltipVisible }" placement="bottomRight" label="全体検索")
  .ComponentsPage__listForTable(if="{ !!tableComponents.length }")
    viron-component(each="{ component, idx in tableComponents }" component="{ component }" entireCurrentSearchRequestParameters="{ parent.getCurrentSearchRequestParametersForComponent(component) }" entireCurrentSearchRequestParametersResetter="{ parent.currentSearchRequestParametersResetter }")
  .ComponentsPage__list(ref="list" if="{ !!notTableComponents.length }")
    viron-component(each="{ component, idx in notTableComponents }" component="{ component }" entireCurrentSearchRequestParameters="{ parent.getCurrentSearchRequestParametersForComponent(component) }" entireCurrentSearchRequestParametersResetter="{ parent.currentSearchRequestParametersResetter }")

  script.
    import '../../organisms/viron-component/index.tag';
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-tooltip/index.tag';
    import script from './index';
    this.external(script);
