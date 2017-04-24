dmc
  .dmc
    //- Debug
    h2 Debug
      button(type='button' onclick="{ evResetCurrent }") Storage->Current リセット
      button(type='button' onclick="{ evResetEndpointALL }") Storage->Endpoint リセット

    //
    dmc-header
    dmc-drawer
    dmc-samplerouter

    main
      dmc-page

  style.
    .dmc {
      background-color: yellow;
    }

  script.
    import constants from '../core/constants';
    import '../samplerouter/dmc-samplerouter.tag';

    let store = this.riotx.get();

    store.change('*', (err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    store.change(constants.CHANGE_PAGE, (err, state, store) => {
      // TODO
      console.log("dmc.tag change page!!!")
    });

    this.evResetCurrent = (ev) => {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };
    this.evResetEndpointALL = () => {
      store.action(constants.ACTION_ENDPOINT_REMOVE_ALL);
    }
