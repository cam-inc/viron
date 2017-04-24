dmc-drawer
  .dmc-drawer
    .page.dashboard(each="{ dashboard }" onclick="{ evSelect }")
      | api.path : { api.path }
      | path.method : { api.method }
      | drawer : { drawer }
      | group : { group }
      | layout : { layout }
      | name : { name }
      | primary : { primary }
      | section : { section }

    .page.manage(each="{ manage }" onclick="{ evSelect }")
      | api.path : { api.path }
      | api.method : { api.method }
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
    import router from '../../core/router';
    let store = this.riotx.get();

    this.dashboard = [];
    this.manage = [];

    store.change(constants.CHANGE_DMC, (err, state, store) => {
      this.dashboard = store.getter(constants.GETTER_DMC_DASHBOARD);
      this.manage = store.getter(constants.GETTER_DMC_MANAGE);
      this.update();
    });

    this.evSelect = (ev) => {
      //router.navigateTo(ev.item.api.path + "/" + ev.item.api.method);
      router.navigateTo(ev.item.api.path + "/" + window.encodeURIComponent(ev.item.api.method) + '/' + ev.item.layout);
    }
