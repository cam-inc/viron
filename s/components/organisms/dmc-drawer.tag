dmc-drawer.Drawer
  .Drawer__head
    .media.Drawer__endpoint
      .media__image.Drawer__endpointImage
      .media__body.Drawer__endpointBody
        .Drawer__endpointBodyHead
          .Drawer__endpointTitle
            | endpoint title
          .Drawer__endpointHost
            | https://foo.com:3000
        .Drawer__endpointBodyTail
          .Drawer__endpointDescription
            | description
    .Drawer__closeButton(click="{handleCloseButtonClick}")
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

    this.dashboard = [];
    this.manage = [];

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
      ev.item.id.get()
      router.navigateTo(ev.item.id.get());
    }
