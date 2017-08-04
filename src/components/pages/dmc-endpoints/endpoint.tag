dmc-endpoint.EndpointsPage__item(ref="touch" onTap="handleTap")
  .EndpointsPage__itemHead
    .EndpointsPage__itemAvatar
      .EndpointsPage__itemThumbnail(style="background-image:url({ opts.thumbnail });")
      div(class="EndpointsPage__itemToken { !!opts.token ? 'EndpointsPage__itemToken--active' : '' }")
    .EndpointsPage__itemMenuButton(ref="touch" onTap="handleMenuButtonTap")
      dmc-icon(type="ellipsis")
  .EndpointsPage__itemBody
    .EndpointsPage__itemName { opts.name }
    .EndpointsPage__itemUrl { opts.url }
    .EndpointsPage__itemTags(if="{ !!opts.tags.length }")
      dmc-tag(each="{ label in opts.tags }" label="{ label }")
    .EndpointsPage__itemDescription { opts.description }
    .EndpointsPage__itemMemo { opts.memo }
  .EndpointsPage__itemMenus(if="{ isMenuOpened }" ref="touch" onTap="handleMenusTap")
    .EndpointsPage__itemMenuFrame
      .EndpointsPage__itemMenu(ref="touch" onTap="handleEditButtonPat") 編集
      .EndpointsPage__itemMenu(ref="touch" onTap="handleRemoveButtonPat") 削除
      .EndpointsPage__itemMenu(ref="touch" onTap="handleQrCodeButtonPat") QR Code
      .EndpointsPage__itemMenu(ref="touch" onTap="handleLogoutButtonPat") ログアウト

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-tag/index.tag';
    import script from './endpoint';
    this.external(script);
