viron-components-page-tables.ComponentsPage_Tables
  .ComponentsPage_Tables__list
    viron-components-page-card(each="{ component in components }" def="{ component }")

  script.
    import '../card/index.tag';
    import script from './index';
    this.external(script);
