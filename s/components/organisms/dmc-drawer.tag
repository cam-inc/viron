dmc-drawer.Drawer
  .Dwawer__section
    .Drawer__sectionTitle ダッシュボード
    .Drawer__list
      .Drawer__listItem(each="{ dashboard }" onclick="{ evSelect }")
        | api.path : { api.path }
        | api.method : { api.method }
        | drawer : { drawer }
        | group : { group }
        | layout : { layout }
        | name : { name }
        | primary : { primary }
        | section : { section }

  .Drawer__section
    .Drawer__sectionTitle 管理画面
    .Drawer__list
      .Drawer__listItem(each="{ manage }" onclick="{ evSelect }")
        | api.path : { api.path }
        | api.method : { api.method }
        | drawer : { drawer }
        | group : { group }
        | layout : { layout }
        | name : { name }
        | primary : { primary }
        | section : { section }

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
