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
    import './group.tag';
    import script from './index';
    this.external(script);
