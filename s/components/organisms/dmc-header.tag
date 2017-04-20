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
    import constants from '../../core/constants';

    let store = this.riotx.get();

    this.pages = [];

    store.change(constants.CHANGE_DMC, (err, state, store) => {
      this.pages = store.getter(constants.GETTER_DMC_DASHBOARD);
      console.log(this.pages);
      this.update();
    });

    this.evSelect = (ev) => {
      location.href = "#" + ev.item.api.id + "/" + ev.item.api.operation;
    }
