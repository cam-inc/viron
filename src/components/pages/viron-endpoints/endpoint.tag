viron-endpoint.EndpointsPage__item(onClick="{ handleClick }")
  .EndpointsPage__itemHead
    .EndpointsPage__itemAvatar
      .EndpointsPage__itemThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
      div(class="EndpointsPage__itemToken { !!opts.endpoint.token ? 'EndpointsPage__itemToken--active' : '' }")
    .EndpointsPage__itemName { opts.endpoint.name }
    .EndpointsPage__itemMenuButton(onClick="{ handleMenuButtonClick }")
      viron-icon(type="ellipsis")
  .EndpointsPage__itemBody
    .EndpointsPage__itemDescription
      viron-markdown(data="{ descriptionsMarkdown }")
    .EndpointsPage__itemMemo { opts.endpoint.memo }
    .EndpointsPage__itemTags(if="{ !!opts.endpoint.tags.length }")
      viron-tag(each="{ label in opts.endpoint.tags }" label="{ label }")
    .EndpointsPage__itemUrl
      .EndpointsPage__itemUrlIcon
        viron-icon(type="link")
      .EndpointsPage__itemUrlLabel { opts.endpoint.url }
  .EndpointsPage__itemTail
    .EndpointsPage__itemMenu(onClick="{ handleEditButtonClick }") 編集
    .EndpointsPage__itemMenu(onClick="{ handleRemoveButtonClick }") 削除
    .EndpointsPage__itemMenu(onClick="{ handleQrCodeButtonClick }") QR Code
    .EndpointsPage__itemMenu(onClick="{ handleLogoutButtonClick }") ログアウト


  script.
    import '../../atoms/viron-button/index.tag';
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-tag/index.tag';
    import '../../atoms/viron-markdown/index.tag';
    import script from './endpoint';
    this.external(script);
