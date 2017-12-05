viron-endpoints-page-endpoint-menu.EndpointsPage_Endpoint_Menu
  .EndpointsPage_Endpoint_Menu__list
    .EndpointsPage_Endpoint_Menu__item(if="{ isDesktop }" onTap="{ handleQRCodeButtonTap }") QRコード
    .EndpointsPage_Endpoint_Menu__item(onTap="{ handleDeleteButtonTap }") エンドポイントを削除
    .EndpointsPage_Endpoint_Menu__item(if="{ isSignined }" onTap="{ handleSignoutButtonTap }") ログアウト

  script.
    import script from './index';
    this.external(script);
