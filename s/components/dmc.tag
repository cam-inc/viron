dmc
  .dmc
    //- Debug
    h2 Debug
      button(type='button' onclick="{ evResetCurrent }") Storage->Current リセット
      button(type='button' onclick="{ evResetEndpointALL }") Storage->Endpoint リセット

    //
    dmc-header
    dmc-drawer
    div.samplepages
      dmc-route(path="/samplepageA")
        dmc-samplepageA
      dmc-route(path="/samplepageB")
        dmc-samplepageB
      dmc-route(path="/samplepageC/:paramOne/:paramTwo")
        dmc-samplepageC
    main
      dmc-page

  style.
    .dmc {
      background-color: yellow;
    }

  script.
    import './pages/dmc-route.tag';
    import './pages/dmc-samplepageA.tag';
    import './pages/dmc-samplepageB.tag';
    import './pages/dmc-samplepageC.tag';
    import constants from '../core/constants';

    let store = this.riotx.get();

    store.change('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    this.evResetCurrent = (ev) => {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };
    this.evResetEndpointALL = () => {
      store.action(constants.ACTION_ENDPOINT_REMOVE_ALL);
    }
