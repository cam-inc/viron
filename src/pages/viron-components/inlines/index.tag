viron-components-page-inlines.ComponentsPage_Inlines
  .ComponentsPage_Inlines__list
    viron-components-page-card(each="{ component in components }" def="{ component }")

  script.
    import '../card/index.tag';
    import script from './index';
    this.external(script);
