dmc-header.Header
  .Header__groups
    .Header__group
      .Header__opener(click="{handleOpenerClick}" class="{ Header__opener--opened : isMenuOpened }")
    .Header__group
      .Header__test
      .Header__test
      .Header__test

  script.
    import constants from '../../core/constants';

    const store = this.riotx.get();

    this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);

    handleOpenerClick(e) {
      e.preventDefault();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_DRAWER_TOGGLE));
    }

    store.change(constants.CHANGE_DRAWER, (err, state, store) => {
      this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);
      this.update();
    });
