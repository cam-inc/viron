dmc
  .dmc-inner
    h1 dmc components
    dmc-text
    button(type='button' onclick="{evTestRiotX}") Test RiotX fire!!


  style.
    .dmc-inner {
      background-color: yellow;
    }

  script.
    let store = this.riotx.get()
    store.on('rename', (err, state, store) => {
      let res = store.getters.rename(state);
      console.log('dmc `rename` on store', res);
    });
    store.on('count', (err, state, store) => {
      let res = store.getters.count(state);
      console.log('dmc `count` on store', res);
    });
    store.on('*', (name, err, state, store) => {
      console.log('dmc `*` on store', err, state, store);
    });

    this.on('mount', () => {
      // emit action's
      store.action('login', "dmc", "password");
      store.action('rename', "go");
      store.action('counter');
    });


