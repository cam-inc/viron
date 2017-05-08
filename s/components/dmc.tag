dmc.Application
  .Application__contents
    .Application__asideColumn(class="{ Application__asideColumn--opened : isMenuOpened }")
      dmc-drawer
    .Application__mainColumn
      .Application__head
        dmc-header
        dmc-toasts
      .Application__page
        dmc-page
  dmc-modals

  script.
    import constants from '../core/constants';
    import './organisms/dmc-toasts.tag';
    import './organisms/dmc-modals.tag';

    let store = this.riotx.get();

    this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);
    store.change(constants.CHANGE_DRAWER, (err, state, store) => {
      this.isMenuOpened = store.getter(constants.GETTER_DRAWER_OPENED);
      this.update();
    });

    store.change('*', (err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });
    store.change(constants.CHANGE_PAGE, (err, state, store) => {
    debugger;
      // TODO
      //-- const targetTagString = 'dmc-' + state.page.layout;
      const targetTagString = 'dmc-components';
      console.log(`[page] dmc.tag change page! ${targetTagString}`)
      riot.mount('dmc-page', targetTagString, state.page);

    });
