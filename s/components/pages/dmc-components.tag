dmc-components.ComponentsPage
  .ComponentsPage__title { name }
  .ComponentsPage__list
    dmc-component(each="{ component, idx in components }" component="{ component }" idx="{ idx }")

  script.
    import constants from '../../core/constants';
    import '../organisms/dmc-component.tag';

    const store = this.riotx.get();

    this.name = store.getter(constants.GETTER_PAGE_NAME);
    this.components = store.getter(constants.GETTER_PAGE_COMPONENTS);

    store.change(constants.CHANGE_PAGE, (err, state, store) => {
      this.name = store.getter(constants.GETTER_PAGE_NAME);
      this.components = store.getter(constants.GETTER_PAGE_COMPONENTS);
      this.update();
    });
