dmc-components.ComponentsPage
  .ComponentsPage__title { name }
  .ComponentsPage__list
    dmc-component(each="{ component, idx in opts.components }" component="{ component }" idx="{ idx }")

  script.
    this.name = opts.name.get();
