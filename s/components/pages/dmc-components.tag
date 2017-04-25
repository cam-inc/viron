dmc-components
  .dmc-components
    .name
      | { name }
    .component(each="{ component, idx in components }")
      dmc-component(data="{ component }" index="{ idx }")

  script.
    this.name = opts.name.get();
    this.components = opts.components;

