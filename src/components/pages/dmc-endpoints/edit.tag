dmc-endpoint-edit.EndpointsPage__edit
  .EndpointsPage__editTitle エンドポイント編集
  .EndpointsPage__editHead
    .EndpointsPage__editThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    .EndpointsPage__editName { opts.endpoint.name || '-' }
  .EndpointsPage__editForm
    dmc-textarea(label="メモ" text="{ memo }" onChange="{ handleMemoChange }")
  .EndpointsPage__editControls
    dmc-button(type="primary" onPat="{ handleEditButtonPat }" label="保存")
    dmc-button(type="secondary" onPat="{ handleCancelButtonPat }" label="キャンセル")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-textarea/index.tag';
    import script from './edit';
    this.external(script);
