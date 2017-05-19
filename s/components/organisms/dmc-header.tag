dmc-header.Header
  .Header__groups
    .Header__group
      .Header__menuButton(if="{ isMenuEnabled }" onClick="{ handleMenuButtonClick }")
        dmc-icon(type="{isMenuOpened ? 'menuUnfold' : 'menuFold'}")
    .Header__group
      .Header__homeButton(onClick="{ handleHomeButtonClick }")
        dmc-icon(type="home")

  script.
    import constants from '../../core/constants';
    import router from '../../core/router';
    import '../atoms/dmc-icon.tag';
    import '../atoms/dmc-button.tag';

    const store = this.riotx.get();

    this.isMenuEnabled = store.getter(constants.GETTER_MENU_ENABLED);
    this.isMenuOpened = store.getter(constants.GETTER_MENU_OPENED);

    handleMenuButtonClick(e) {
      e.preventUpdate = false;
      e.preventDefault();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_MENU_TOGGLE));
    }

    handleHomeButtonClick(e) {
      e.preventUpdate = false;
      e.preventDefault();
      router.navigateTo('/');
    }

    store.change(constants.CHANGE_MENU, (err, state, store) => {
      this.isMenuEnabled = store.getter(constants.GETTER_MENU_ENABLED);
      this.isMenuOpened = store.getter(constants.GETTER_MENU_OPENED);
      this.update();
    });
