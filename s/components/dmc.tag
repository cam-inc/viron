dmc
  .dmc
    //- Example
    h1 dmc components
    dmc-text
    button(type='button' onclick="{evTestRiotX}") Test RiotX fire!!

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
