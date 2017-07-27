dmc-components.Page.ComponentsPage
  .ComponentsPage__title { name }
  .ComponentsPage__listWrapper
    .ComponentsPage__list(ref="list")
      dmc-component(each="{ component, idx in components }" component="{ component }")

  script.
    import '../../organisms/dmc-component/index.tag';
    import script from './index';
    this.external(script);
