dmc-endpoints
  .dmc-endpoints
    .endpoint(each="{ item, url in endpoint; }" onclick="{ evEntry }")
      | Name: { item.name }
      | Tags: { item.tags.join(', ') }
      | URL: { url }

  style.
    .endpoint {
      margin: 10px;
      border: solid 1px green;
    }

  script.
    import constants from '../../core/constants';

    const store = this.riotx.get();
    this.endpoint = {};
    store.on(constants.ACTION_ENDPOINT_SHOW, (err, state, store) => {
      this.endpoint = state.endpoint;
      this.update()
    })

    this.evEntry = (ev) => {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_CURRENT_UPDATE, ev.item.url))
        .catch((err) => {
          // TODO
        });
    }
