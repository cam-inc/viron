dmc-components
  .dmc-components
    .name
      | { name }
    .component(each="{ component, idx in components }")
      dmc-component(data="{ component }" index="{ idx }")

  script.
    import swagger from '../../swagger';
    this.name = swagger.getStringValue(opts.data.name);
    this.components = opts.data.components;

