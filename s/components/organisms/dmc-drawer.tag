dmc-drawer.Drawer
  .Drawer__head
    .media.Drawer__endpoint
      .media__image.Drawer__endpointImage(style="background-image:url({ endpoint.thumbnail })")
      .media__body.Drawer__endpointBody
        .Drawer__endpointBodyHead
          .Drawer__endpointTitle { endpoint.name }
          .Drawer__endpointHost { endpoint.url }
        .Drawer__endpointBodyTail
          .Drawer__endpointDescription { endpoint.description }
    .Drawer__closeButton(click="{ handleCloseButtonClick }")
      dmc-icon(type="close")
  .Drawer__body
    .Dwawer__section
      .Drawer__sectionTitle ダッシュボード
      .Drawer__list
        .Drawer__listItem(each="{ dashboard }" onclick="{ evSelect }")
          dmc-icon.Drawer__listItemIcon(type="codeSquareO")
          .Drawer__listItemTitle
            | { name.get() }
          dmc-icon(type="up")
    .Drawer__section
      .Drawer__sectionTitle 管理画面
      .Drawer__list
        .Drawer__listItem(each="{ manage }" onclick="{ evSelect }")
          dmc-icon.Drawer__listItemIcon(type="codeSquareO")
          .Drawer__listItemTitle
            | { name.get() }
          dmc-icon(type="up")

  script.
    import constants from '../../core/constants';
    import router from '../../core/router';
    import '../atoms/dmc-icon.tag';

    let store = this.riotx.get();

    this.endpoint = store.getter(constants.GETTER_ENDPOINT_ONE, store.getter(constants.GETTER_CURRENT));
    this.dashboard = [];
    this.manage = [];

    store.change(constants.CHANGE_ENDPOINT, (err, state, store) => {
      const current = store.getter(constants.GETTER_CURRENT);
      this.endpoint = store.getter(constants.GETTER_ENDPOINT_ONE, current);
      this.update();
    });

    store.change(constants.CHANGE_DMC, (err, state, store) => {
      this.dashboard = store.getter(constants.GETTER_DMC_DASHBOARD);
      this.manage = store.getter(constants.GETTER_DMC_MANAGE);
      this.update();
    });

    handleCloseButtonClick(e) {
      e.preventDefault();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_DRAWER_CLOSE));
    }

    this.evSelect = (ev) => {
      // TODO: current値を参照できるかも
      let param = router.resolveCurrentPath('/:endpoint/:page?')
      router.navigateTo(`/${param.endpoint}/${ev.item.id.get()}`);
    }
