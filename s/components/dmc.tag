dmc.Application
  .Application__contents
    .Application__asideColumn(class="{ Application__asideColumn--opened : isMenuOpened }")
      dmc-drawer
    .Application__mainColumn
      .Application__head
        dmc-header
      .Application__page
        i am main column
        h2 Debug
          button(type='button' onclick="{ evResetCurrent }") Storage->Current リセット
          button(type='button' onclick="{ evResetEndpointALL }") Storage->Endpoint リセット
        dmc-samplerouter
        main
          dmc-page

  script.
    import constants from '../core/constants';
    import '../samplerouter/dmc-samplerouter.tag';

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
      // TODO
      const targetTagString = 'dmc-' + state.page.layout;
      console.log(`[page] dmc.tag change page! ${targetTagString}`)
      riot.mount('dmc-page', targetTagString, state.page);

    });

    this.evResetCurrent = (ev) => {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };
    this.evResetEndpointALL = () => {
      store.action(constants.ACTION_ENDPOINT_REMOVE_ALL);
    }
