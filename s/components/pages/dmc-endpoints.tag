dmc-endpoints.EndpointsPage
  .EndpointsPage__list
    .EndpointsPage__addCard(onClick="{ handleEndpointAdd }")
      dmc-icon(type="plus")
    virtual(each="{ endpoint, key in endpoints }")
      dmc-endpoint(key="{ key }"
        name="{ endpoint.name }"
        thumbnail="{ endpoint.thumbnail }"
        token="{ endpoint.token }"
        url="{ endpoint.url }"
        description="{ endpoint.description }"
        memo="{ endpoint.memo }"
        tags="{ endpoint.tags }"
        onEntry="{ handleEndpointEntry }"
        onEdit="{ handleEndpointEdit }"
        onRemove="{ handleEndpointRemove }"
        onLogout="{ handleEndpointLogout }")

  script.
    import router from '../../core/router';
    import constants from '../../core/constants';
    import '../organisms/dmc-endpoint.tag';
    import '../organisms/dmc-entry.tag';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    this.endpoints = store.getter(constants.GETTER_ENDPOINTS);

    store.change(constants.CHANGE_ENDPOINTS, (err, state, store) => {
      this.endpoints = store.getter(constants.GETTER_ENDPOINTS);
      this.update()
    })

    handleEndpointAdd(e) {
      e.preventUpdate = false;
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-entry');
    }

    handleEndpointEntry(key) {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_AUTH_VALIDATE, key))
        .then(isValid => {
          // if token is valid, then navigae to the page.
          // if no valid, show sign-in modal.
          if (!isValid) {
            return store.action(constants.ACTION_AUTH_SIGN_IN_SHOW, key);
          }
          return router.navigateTo(`/${key}`);
        });
    }

    handleEndpointEdit(key) {
      // TODO
    }

    handleEndpointRemove(key) {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_ENDPOINTS_REMOVE, key))
        .catch(err => store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message
        }))
      ;
    }

    handleEndpointLogout(key) {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_AUTH_REMOVE, key))
        .catch(err => store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message
        }));
    }
