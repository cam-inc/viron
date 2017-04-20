dmc
  .dmc
    //- Example
    h1 dmc components
    dmc-text
    button(type='button' onclick="{ evResetCurrent }") Current Endpoint リセット

    //
    dmc-header
    dmc-drawer
    div.samplepages
      dmc-route(path="/samplepageA")
        dmc-samplepageA
      dmc-route(path="/samplepageB")
        dmc-samplepageB
      dmc-route(path="/samplepageC")
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

    store.on('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    this.evResetCurrent = (ev) => {
      store.action(constants.ACTION_CURRENT_REMOVE);
    };
