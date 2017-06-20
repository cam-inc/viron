dmc-endpoint.EndpointsPage__item(ref="touch" onTap="handleTap")
  .EndpointsPage__itemHead
    .EndpointsPage__itemAvatar
      .EndpointsPage__itemThumbnail(style="background-image:url({ opts.thumbnail });")
      div(class="EndpointsPage__itemToken { !!opts.token ? 'EndpointsPage__itemToken--active' : '' }")
    .EndpointsPage__itemMenuButton(ref="touch" onTap="handleMenuButtonTap")
      dmc-icon(type="ellipsis")
  .EndpointsPage__itemBody
    .EndpointsPage__itemTags(if="{ !!opts.tags.length }")
      dmc-tag(each="{ label in opts.tags }" label="{ label }")
    .EndpointsPage__itemUrl { opts.url }
    .EndpointsPage__itemName { opts.name }
    .EndpointsPage__itemDescription { opts.description }
    .EndpointsPage__itemMemo { opts.memo }
  .EndpointsPage__itemMenus(if="{ isMenuOpened }" ref="touch" onTap="handleMenusTap")
    .EndpointsPage__itemMenuFrame
      dmc-button(onPat="{ handleEditButtonPat }" label="編集")
      dmc-button(onPat="{ handleRemoveButtonPat }" label="削除")
      dmc-button(onPat="{ handleLogoutButtonPat }" label="ログアウト")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-tag/index.tag';
    import script from './endpoint';
    this.external(script);
