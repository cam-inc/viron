viron-components.Page.ComponentsPage
  .ComponentsPage__head
    .ComponentsPage__breadcrumb
      .ComponentsPage__breadcrumbIcon
        viron-icon(type="home")
      .ComponentsPage__breadcrumbIcon
        viron-icon(type="right")
      .ComponentsPage__breadcrumbLabel { name } ({ componentsCount })
    .ComponentsPage__control
      .ComponentsPage__search(if="{ !!getParameterObjectsForSearch().length }" class="{ isCurrentSearchRequestParametersEmpty() ? '' : 'ComponentsPage__search--active' }" ref="touch" onTap="handleSearchButtonTap")
        viron-icon(type="search")
  .ComponentsPage__listForTable(if="{ !!tableComponents.length }")
    viron-component(each="{ component, idx in tableComponents }" component="{ component }" entireCurrentSearchRequestParameters="{ parent.getCurrentSearchRequestParametersForComponent(component) }" entireCurrentSearchRequestParametersResetter="{ parent.currentSearchRequestParametersResetter }")
  .ComponentsPage__list(ref="list" if="{ !!notTableComponents.length }")
    viron-component(each="{ component, idx in notTableComponents }" component="{ component }" entireCurrentSearchRequestParameters="{ parent.getCurrentSearchRequestParametersForComponent(component) }" entireCurrentSearchRequestParametersResetter="{ parent.currentSearchRequestParametersResetter }")

  script.
    import '../../organisms/viron-component/index.tag';
    import '../../atoms/viron-icon/index.tag';
    import script from './index';
    this.external(script);
