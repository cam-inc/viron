dmc
  .dmc
    //- Example
    h1 dmc components
    dmc-text
    button(type='button' onclick="{evTestRiotX}") Test RiotX fire!!

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
    import swagger from '../swagger';
    let store = this.riotx.get();

    store.on('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });
