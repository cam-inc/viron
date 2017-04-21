dmc-text
  .dmc-text
    | dmc text component
    input(type="text")

  style.
    .dmc-text {
      background-color: red;
    }
  script.
    let store = this.riotx.get()

    store.change('TODO', (err, state, store) => {
      let res = store.getter('TODO');
      console.log('dmc-text `login` on store', res);
    })
