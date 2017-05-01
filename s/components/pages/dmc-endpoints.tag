dmc-endpoints.EndpointsPage
  .EndpointsPage__list
    .EndpointsPage__addCard(click="{handleEndpointAdd}")
      dmc-icon(type="plus")
    virtual(each="{ item, url in endpoint }")
      dmc-endpoint(host="{ url }" title="{ item.title }" thumbnail="{ item.thumbnail }" description="{ item.description }" tags="{ item.tags }" onentry="{ handleEndpointEntry }" onedit="{ handleEndpointEdit }" onremove="{ handleEndpointRemove }")

  script.
    import constants from '../../core/constants';
    import '../organisms/dmc-endpoint.tag';
    import '../organisms/dmc-login.tag';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();
    this.endpoint = {};
    store.change(constants.CHANGE_ENDPOINT, (err, state, store) => {
      this.endpoint = state.endpoint;
      this.update()
    })

    handleEndpointAdd() {
      // TODO: endpoint作成 -> ログイン -> 成功 -> endpoint一覧に追加される。
      //store.action(constants.ACTION_MODAL_SHOW, 'dmc-endpoint-create', {
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-login', {
        onLogin: () => {
          alert('login success');
        }
      });
    }

    handleEndpointEntry(url) {
      store.action(constants.ACTION_AUTH_UPDATE, url)
        .then(() => {
          store.action(constants.ACTION_CURRENT_UPDATE, url)
        })
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
