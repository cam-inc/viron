viron-endpoints-page-endpoint-menu.EndpointsPage_Endpoint_Menu
  div(onTap="{ handleEditButtonTap }") 編集
  div(onTap="{ handleDeleteButtonTap }") 削除
  div(onTap="{ handleQRCodeButtonTap }") QR Code
  div(onTap="{ handleSignoutButtonTap }") サインアウト

  script.
    import script from './index';
    this.external(script);
