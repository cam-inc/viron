dmc-drawer.Drawer
  .Drawer__head
    .media.Drawer__endpoint
      .media__image.Drawer__endpointImage(if="{ !!endpoint }" style="background-image:url({ endpoint.thumbnail })")
      .media__body.Drawer__endpointBody
        .Drawer__endpointBodyHead
          .Drawer__endpointTitle(if="{ !!endpoint }") { endpoint.name }
          .Drawer__endpointHost(if="{ !!endpoint }") { endpoint.url }
        .Drawer__endpointBodyTail
          .Drawer__endpointDescription(if="{ !!endpoint }") { endpoint.description }
    .Drawer__closeButton(click="{ handleCloseButtonClick }")
      dmc-icon(type="close")
  .Drawer__body
    .Dwawer__section
      .Drawer__sectionTitle ダッシュボード
      .Drawer__groups
        dmc-drawer-group(each="{ group in groupedDashboard }" group="{ group }")
    .Drawer__section
      .Drawer__sectionTitle 管理画面
      .Drawer__groups
        dmc-drawer-group(each="{ group in groupedManage }" group="{ group }")

  script.
    import { forEach } from 'mout/array';
    import { forOwn } from 'mout/object';
    import constants from '../../core/constants';
    import router from '../../core/router';
    import '../atoms/dmc-icon.tag';

    const store = this.riotx.get();

    const group = (items) => {
      const groups = {};
      let counter = 0;
      forEach(items, (item, idx) => {
        const assignment = item.group.get() || `independent_${idx}`;
        if (!groups[assignment]) {
          groups[assignment] = {
            name: assignment,
            index: counter,
            list: [],
            isIndependent: !item.group.get()
          };
          counter = counter + 1;
        }
        groups[assignment].list.push(item);
      });

      const ret = [];
      forOwn(groups, val => {
        const index = val.index;
        delete val.index;
        ret[index] = val;
      });

      return ret;
    }

    this.endpoint = store.getter(constants.GETTER_ENDPOINTS_ONE, store.getter(constants.GETTER_CURRENT));
    const dashboard = store.getter(constants.GETTER_DMC_DASHBOARD);
    const manage = store.getter(constants.GETTER_DMC_MANAGE);
    this.groupedDashboard = group(dashboard);
    this.groupedManage = group(manage);

    store.change(constants.CHANGE_ENDPOINTS, (err, state, store) => {
      const current = store.getter(constants.GETTER_CURRENT);
      this.endpoint = store.getter(constants.GETTER_ENDPOINTS_ONE, current);
      this.update();
    });

    store.change(constants.CHANGE_DMC, (err, state, store) => {
      const dashboard = store.getter(constants.GETTER_DMC_DASHBOARD);
      const manage = store.getter(constants.GETTER_DMC_MANAGE);
      this.groupedDashboard = group(dashboard);
      this.groupedManage = group(manage);
      this.update();
    });

    handleCloseButtonClick(e) {
      e.preventDefault();
      Promise
        .resolve()
        .then(() => store.action(constants.ACTION_DRAWER_CLOSE));
    }

dmc-drawer-group(class="Drawer__group")
  .Drawer__groupToggle(onClick="{ handleToggleClick }")
    dmc-icon(type="codeSquareO" class="Drawer__groupIconHead")
    .Drawer__groupName { opts.group.isIndependent ? opts.group.list[0].name.get() : opts.group.name }
    dmc-icon(if="{ !opts.group.isIndependent }" type="up" class="Drawer__groupIconTail { isOpened ? 'Drawer__groupIconTail--opened' : '' }")
  div(class="Drawer__groupList { isOpened ? 'Drawer__groupList--opened' : '' }" if="{ !opts.group.isIndependent }")
    .Drawer__groupListItem(each="{ opts.group.list }" onClick="{ handleGroupItemClick }") { name.get() }

  script.
    import '../atoms/dmc-icon.tag';

    this.isOpened = false;

    handleToggleClick() {
      if (this.opts.group.isIndependent) {
        // TODO: current値を参照できるかも
        let param = router.resolveCurrentPath('/:endpoint/:page?')
        router.navigateTo(`/${param.endpoint}/${this.opts.group.list[0].id.get()}`);
      } else {
        this.isOpened = !this.isOpened;
        this.update();
      }
    }

    handleGroupItemClick(e) {
      let param = router.resolveCurrentPath('/:endpoint/:page?')
      router.navigateTo(`/${param.endpoint}/${e.item.id.get()}`);
    }
