dmc-components.Page.ComponentsPage
  .ComponentsPage__breadcrumb
    .ComponentsPage__breadcrumbIcon
      dmc-icon(type="home")
    .ComponentsPage__breadcrumbIcon
      dmc-icon(type="right")
    .ComponentsPage__breadcrumbLabel { name } ({ componentsCount })
  .ComponentsPage__list(ref="list")
    dmc-component(each="{ component, idx in components }" component="{ component }")

  script.
    import '../../organisms/dmc-component/index.tag';
    import script from './index';
    this.external(script);
