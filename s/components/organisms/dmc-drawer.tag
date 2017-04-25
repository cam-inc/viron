dmc-drawer
  .dmc-drawer
    .page.dashboard(each="{ dashboard }" onclick="{ evSelect }")
      pre { section }/{ group }/{ name }/{ api.path }:{ api.method }

    .page.manage(each="{ manage }" onclick="{ evSelect }")
      pre { section }/{ group }/{ name }/{ api.path }:{ api.method }

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
      router.navigateTo(ev.item.api.path + "/" + window.encodeURIComponent(ev.item.api.method));
    }
