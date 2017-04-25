dmc-endpoints.EndpointsPage
  .EndpointsPage__list
    virtual(each="{ item, url in endpoint }")
      dmc-endpoint(host="{ url }" name="{ item.name }" onentry="{ handleEndpointEntry }" onedit="{ handleEndpointEdit }" onremove="{ handleEndpointRemove }")

  script.
    import constants from '../../core/constants';
    import '../organisms/dmc-endpoint.tag';

    const store = this.riotx.get();
    this.endpoint = {};
    store.change(constants.CHANGE_ENDPOINT, (err, state, store) => {
      this.endpoint = state.endpoint;
      this.update()
    })

    handleEndpointEntry(url) {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_CURRENT_UPDATE, url))
        .catch((err) => {
          // TODO
        })
      ;
    }

    handleEndpointEdit(url) {
      throw new Error("TODO not support ... :P ");
    }

    handleEndpointRemove(url) {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_ENDPOINT_REMOVE, url))
        .catch((err) => {
          // TODO
        })
      ;
    }
