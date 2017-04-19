dmc-header
  .dmc-header
    .page(each="{ item, url in endpoint; }" onclick="{ evEntry }")
  script.
    import { forOwn } from "mout/object";
    let store = this.riotx.get();
    store.on("dmc_show", (err, state, store) => {

      this.dmc = state.dmc;
      console.log(this.dmc)
      console.log(forOwn)
      this.riotx.getters.dmc_dashboard();
      debugger;
      this.update()
    })
