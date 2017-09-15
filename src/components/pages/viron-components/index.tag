viron-components.Page.ComponentsPage
  .ComponentsPage__breadcrumb
    .ComponentsPage__breadcrumbIcon
      viron-icon(type="home")
    .ComponentsPage__breadcrumbIcon
      viron-icon(type="right")
    .ComponentsPage__breadcrumbLabel { name } ({ componentsCount })
  .ComponentsPage__listForTable(if="{ !!tableComponents.length }")
    viron-component(each="{ component, idx in tableComponents }" component="{ component }")
  .ComponentsPage__list(ref="list" if="{ !!notTableComponents.length }")
    viron-component(each="{ component, idx in notTableComponents }" component="{ component }")

  script.
    import '../../organisms/viron-component/index.tag';
    import script from './index';
    this.external(script);
