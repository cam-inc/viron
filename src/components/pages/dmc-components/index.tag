dmc-components.Page.ComponentsPage
  .ComponentsPage__title { name }
  .ComponentsPage__list
    dmc-component(each="{ component, idx in components }" component="{ component }")

  script.
    import '../../organisms/dmc-component/index.tag';
    import script from './index';
    this.external(script);
