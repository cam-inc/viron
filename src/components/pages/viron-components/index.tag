viron-components.Page.ComponentsPage
  .ComponentsPage__breadcrumb
    .ComponentsPage__breadcrumbIcon
      viron-icon(type="home")
    .ComponentsPage__breadcrumbIcon
      viron-icon(type="right")
    .ComponentsPage__breadcrumbLabel { name } ({ componentsCount })
  .ComponentsPage__list(ref="list")
    viron-component(each="{ component, idx in components }" component="{ component }")

  script.
    import '../../organisms/viron-component/index.tag';
    import script from './index';
    this.external(script);
