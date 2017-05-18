dmc-drawers.Drawers
  virtual(each="{ drawers }")
    dmc-drawer(id="{ id }" tagname="{ tagName }" tagopts="{ tagOpts }" theme="{ drawerOpts.theme }")

  script.
    import constants from '../../core/constants';
    import '../organisms/dmc-drawer.tag';

    const store = this.riotx.get();

    this.drawers = store.getter(constants.GETTER_DRAWER_LIST);

    store.change(constants.CHANGE_DRAWER, (err, state, store) => {
      this.drawers = store.getter(constants.GETTER_DRAWER_LIST);
      this.update();
    });
