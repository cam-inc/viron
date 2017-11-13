viron-endpoints-page-endpoint-menu-edit.EndpointsPage_Endpoint_Menu_Edit
  .EndpointsPage_Endpoint_Menu_Edit__title エンドポイント編集
  .EndpointsPage_Endpoint_Menu_Edit__thumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
  .EndpointsPage_Endpoint_Menu_Edit__name name: { opts.endpoint.name }
  .EndpointsPage_Endpoint_Menu_Edit__inputs
    viron-textarea(label="メモ" val="{ memo }" onChange="{ handleMemoChange }")
  .EndpointsPage_Endpoint_Menu_Edit__control
    viron-button(label="保存" onSelect="{ handleSaveButtonSelect }")
    viron-button(theme="ghost" label="キャンセル" onSelect="{ handleCancelButtonSelect }")

  script.
    import '../../../../../components/viron-textarea/index.tag';
    import '../../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
