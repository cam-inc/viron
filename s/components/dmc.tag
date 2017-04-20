dmc
  .dmc
    //- Example
    h1 dmc components
    dmc-text
    button(type='button' onclick="{ evResetCurrent }") Current Endpoint リセット

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
