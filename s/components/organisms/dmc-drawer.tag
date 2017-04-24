dmc-drawer
  .dmc-drawer
    .page.dashboard(each="{ dashboard }" onclick="{ evSelect }")
      | api.id : { api.id }
      | api.operation : { api.operation }
      | drawer : { drawer }
      | group : { group }
      | layout : { layout }
      | name : { name }
      | primary : { primary }
      | section : { section }

    .page.manage(each="{ manage }" onclick="{ evSelect }")
      | api.id : { api.id }
      | api.operation : { api.operation }
      | drawer : { drawer }
      | group : { group }
      | layout : { layout }
      | name : { name }
      | primary : { primary }
      | section : { section }

  style.
    .dmc-drawer .dashboard {
      margin: 18px;
      background: green;
    }
    .dmc-drawer .manage {
      margin: 18px;
      background: blue;
    }

  script.
    import constants from '../../core/constants';

    let store = this.riotx.get();

    this.dashboard = [];
    this.manage = [];

    store.change(constants.CHANGE_DMC, (err, state, store) => {
      this.dashboard = store.getter(constants.GETTER_DMC_DASHBOARD);
      this.manage = store.getter(constants.GETTER_DMC_MANAGE);
      this.update();
    });

    this.evSelect = (ev) => {
      location.href = "#" + ev.item.api.id + "/" + ev.item.api.operation;
    }
