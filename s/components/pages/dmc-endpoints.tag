dmc-endpoints
  .dmc-endpoints(style="margin:20px")
    .endpoint(each="{ item, url in endpoint; }")
      img(src="{ item.thumbnail }" width="50px" height="50px")
      | Name: { item.title }
      | Description: { item.description }
      | Version: { item.version }
      | Theme: { item.theme }
      | Tags: { item.tags.join(', ') }
      | URL: { url }

      button(type='button' onclick="{ evEntry }") 入場
      button(type='button' onclick="{ evEdit }") 編集
      button(type='button' onclick="{ evRemove }") 削除

  style.
    .endpoint {
      margin: 10px;
      border: solid 1px green;
    }

  script.
    import constants from '../../core/constants';

    const store = this.riotx.get();
    this.endpoint = {};
    store.change(constants.CHANGE_ENDPOINT, (err, state, store) => {
      this.endpoint = state.endpoint;
      this.update()
    })

    this.evEntry = (ev) => {
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_CURRENT_UPDATE, ev.item.url))
        .catch((err) => {
          // TODO
        })
      ;
    }

    this.evEdit = (ev) => {
      throw new Error("TODO not support ... :P ");
    }

    this.evRemove = (ev) => {
      ev.item.url
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_ENDPOINT_REMOVE, ev.item.url))
        .catch((err) => {
          // TODO
        })
      ;
    }
