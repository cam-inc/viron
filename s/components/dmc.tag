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
    debugger;
    let store = this.riotx.get();

    store.on('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    <!--this.on('mount', () => {-->
      <!--// emit action's-->
      <!--&lt;!&ndash;store.action('login', "dmc", "password");&ndash;&gt;-->
      <!--&lt;!&ndash;store.action('rename', "go");&ndash;&gt;-->
      <!--&lt;!&ndash;store.action('counter');&ndash;&gt;-->
      <!--store.action('dmc_show')-->
    <!--});-->
