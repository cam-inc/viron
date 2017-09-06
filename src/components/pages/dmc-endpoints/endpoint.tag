dmc-endpoint.EndpointsPage__item(ref="touch" onTap="handleTap")
  .EndpointsPage__itemHead
    .EndpointsPage__itemAvatar
      .EndpointsPage__itemThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
      div(class="EndpointsPage__itemToken { !!opts.endpoint.token ? 'EndpointsPage__itemToken--active' : '' }")
    .EndpointsPage__itemName { opts.endpoint.name }
    .EndpointsPage__itemMenuButton(ref="touch" onTap="handleMenuButtonTap")
      dmc-icon(type="ellipsis")
  .EndpointsPage__itemBody
    .EndpointsPage__itemDescription
      dmc-markdown(data="{ descriptionsMarkdown }")
    .EndpointsPage__itemMemo { opts.endpoint.memo }
    .EndpointsPage__itemTags(if="{ !!opts.endpoint.tags.length }")
      dmc-tag(each="{ label in opts.endpoint.tags }" label="{ label }")
    .EndpointsPage__itemUrl
      .EndpointsPage__itemUrlIcon
        dmc-icon(type="link")
      .EndpointsPage__itemUrlLabel { opts.endpoint.url }
  .EndpointsPage__itemTail
    .EndpointsPage__itemMenu(ref="touch" onTap="handleEditButtonPat") 編集
    .EndpointsPage__itemMenu(ref="touch" onTap="handleRemoveButtonPat") 削除
    .EndpointsPage__itemMenu(ref="touch" onTap="handleQrCodeButtonPat") QR Code
    .EndpointsPage__itemMenu(ref="touch" onTap="handleLogoutButtonPat") ログアウト


  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-tag/index.tag';
    import '../../atoms/dmc-markdown/index.tag';
    import script from './endpoint';
    this.external(script);
