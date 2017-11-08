viron-endpoint-edit.EndpointsPage__edit
  .EndpointsPage__editTitle エンドポイント編集
  .EndpointsPage__editHead
    .EndpointsPage__editThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    .EndpointsPage__editName { opts.endpoint.name || '-' }
  .EndpointsPage__editForm
    viron-textarea(label="メモ" text="{ memo }" onChange="{ handleMemoChange }")
  .EndpointsPage__editControls
    viron-button(type="primary" onClick="{ handleEditButtonClick }" label="保存")
    viron-button(type="secondary" onClick="{ handleCancelButtonClick }" label="キャンセル")

  script.
    import '../../atoms/viron-button/index.tag';
    import '../../atoms/viron-textarea/index.tag';
    import script from './edit';
    this.external(script);
