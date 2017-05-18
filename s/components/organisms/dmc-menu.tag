dmc-menu.Menu
  .Menu__head
    .media.Menu__endpoint
      .media__image.Menu__endpointImage(if="{ !!endpoint }" style="background-image:url({ endpoint.thumbnail })")
      .media__body.Menu__endpointBody
        .Menu__endpointBodyHead
          .Menu__endpointTitle(if="{ !!endpoint }") { endpoint.name }
          .Menu__endpointHost(if="{ !!endpoint }") { endpoint.url }
        .Menu__endpointBodyTail
          .Menu__endpointDescription(if="{ !!endpoint }") { endpoint.description }
    .Menu__closeButton(click="{ handleCloseButtonClick }")
      dmc-icon(type="close")
  .Menu__body
    .Menu__section
      .Menu__sectionTitle ダッシュボード
      .Menu__groups
        dmc-menu-group(each="{ group in groupedDashboard }" group="{ group }")
    .Menu__section
      .Menu__sectionTitle 管理画面
      .Menu__groups
        dmc-menu-group(each="{ group in groupedManage }" group="{ group }")

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
        const assignment = item.group || `independent_${idx}`;
        if (!groups[assignment]) {
          groups[assignment] = {
            name: assignment,
            index: counter,
            list: [],
            isIndependent: !item.group
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
        .then(() => store.action(constants.ACTION_MENU_CLOSE));
    }

dmc-menu-group(class="Menu__group")
  .Menu__groupToggle(onClick="{ handleToggleClick }")
    dmc-icon(type="codeSquareO" class="Menu__groupIconHead")
    .Menu__groupName { opts.group.isIndependent ? opts.group.list[0].name : opts.group.name }
    dmc-icon(if="{ !opts.group.isIndependent }" type="up" class="Menu__groupIconTail { isOpened ? 'Menu__groupIconTail--opened' : '' }")
  div(class="Menu__groupList { isOpened ? 'Menu__groupList--opened' : '' }" if="{ !opts.group.isIndependent }")
    .Menu__groupListItem(each="{ opts.group.list }" onClick="{ handleGroupItemClick }") { name }

  script.
    import '../atoms/dmc-icon.tag';

    this.isOpened = false;

    const store = this.riotx.get();

    handleToggleClick() {
      if (this.opts.group.isIndependent) {
        router.navigateTo(`/${store.getter(constants.GETTER_CURRENT)}/${this.opts.group.list[0].id}`);
      } else {
        this.isOpened = !this.isOpened;
        this.update();
      }
    }

    handleGroupItemClick(e) {
      router.navigateTo(`/${store.getter(constants.GETTER_CURRENT)}/${e.item.id}`);
    }
