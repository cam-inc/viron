dmc
  .dmc
    //- Debug
    h2 Debug
      button(type='button' onclick="{ evResetCurrent }") Storage->Current リセット
      button(type='button' onclick="{ evResetEndpointALL }") Storage->Endpoint リセット

    //
    dmc-header
    dmc-drawer
    main
      dmc-page

  style.
    .dmc {
      background-color: yellow;
    }

  script.
    import constants from '../core/constants';
    import swagger from '../swagger';

    let store = this.riotx.get();

    store.on('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    this.evResetCurrent = (ev) => {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };
    this.evResetEndpointALL = () => {
      store.action(constants.ACTION_ENDPOINT_REMOVE_ALL)
      .then(() => store.action(constants.ACTION_ENDPOINT_SHOW))
    }
