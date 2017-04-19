dmc-header
  .dmc-header
    .page(each="{ pages }" onclick="{ evSelect }")
      | api.id : { api.id }
      | api.operation : { api.operation }
      | drawer : { drawer }
      | group : { group }
      | layout : { layout }
      | name : { name }
      | primary : { primary }
      | section : { section }
  style.
    .dmc-header .page {
      margin: 18px;
    }

  script.
    let store = this.riotx.get();

    this.pages = [];

    store.on("dmc_show", (err, state, store) => {
      this.dmc = state.dmc;
      this.pages = store.getter("dmc_dashboard");
      console.log(this.pages);
      this.update();
    })

    this.evSelect = (ev) => {
      debugger;
      location.href = "#" + ev.item.api.id + "/" + ev.item.api.operation;
    }
