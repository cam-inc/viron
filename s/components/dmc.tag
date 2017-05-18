dmc.Application
  .Application__contents
    .Application__asideColumn(class="{ Application__asideColumn--opened : isMenuOpened }")
      dmc-menu
    .Application__mainColumn
      .Application__head
        dmc-header
      .Application__page
        div(data-is="{ pageTagName }")
  dmc-modals
  dmc-toasts

  script.
    import constants from '../core/constants';
    import router from '../core/router';
    import './pages/dmc-components.tag';
    import './pages/dmc-empty.tag';
    import './pages/dmc-endpoints.tag';
    import './pages/dmc-loading.tag';
    import './pages/dmc-notfound.tag';
    import './organisms/dmc-menu.tag';
    import './organisms/dmc-header.tag';
    import './organisms/dmc-signin.tag';
    import './organisms/dmc-toasts.tag';
    import './organisms/dmc-modals.tag';

    const store = this.riotx.get();

    this.pageTagName = store.getter(constants.GETTER_LOCATION_TAG);

    const isEnabled = store.getter(constants.GETTER_MENU_ENABLED);
    const isOpened = store.getter(constants.GETTER_MENU_OPENED);
    this.isMenuOpened = isEnabled && isOpened;

    store.change(constants.CHANGE_MENU, (err, state, store) => {
      const isEnabled = store.getter(constants.GETTER_MENU_ENABLED);
      const isOpened = store.getter(constants.GETTER_MENU_OPENED);
      this.isMenuOpened = isEnabled && isOpened;
      this.update();
    });

    store.change(constants.CHANGE_LOCATION, (err, state, store) => {
      this.pageTagName = store.getter(constants.GETTER_LOCATION_TAG);
      this.update();
    });

    store.change(constants.CHANGE_SIGN_IN, (err, state, store) => {
      // 認証
      const key = store.getter(constants.GETTER_AUTH_SIGN_IN_SHOW_KEY);
      const endpoint = store.getter(constants.GETTER_ENDPOINTS_ONE, key);
      if (!endpoint) {
        return router.navigateTo('/');
      }
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_AUTHTYPE_GET, key))
        .then(authtypes => {
          store.action(constants.ACTION_MODAL_SHOW, 'dmc-signin', {
            key,
            endpoint,
            authtypes,
            onSignIn: () => {
              router.navigateTo(`/${key}`);
            }
          });
        })
        .catch(err => {
          store.action(constants.ACTION_TOAST_SHOW, {
            message: err.message
          })
        });
    });
