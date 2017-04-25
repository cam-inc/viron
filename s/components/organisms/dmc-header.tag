dmc-header.Header
  .Header__groups
    .Header__group
      .Header__menuButton(click="{handleMenuButtonClick}")
        dmc-icon(type="{isMenuOpened ? 'menuUnfold' : 'menuFold'}")
    .Header__group
      .Header__test
      .Header__test
      .Header__homeButton(click="{handleHomeButtonClick}")
        dmc-icon(type="home")

  script.
    import constants from '../../core/constants';
    import router from '../../core/router';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);

    handleMenuButtonClick(e) {
      e.preventDefault();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_DRAWER_TOGGLE));
    }

    handleHomeButtonClick(e) {
      e.preventDefault();
      router.navigateTo('/');
    }

    store.change(constants.CHANGE_DRAWER, (err, state, store) => {
      this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);
      this.update();
    });
