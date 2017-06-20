dmc-entry.EndpointsPage__entry
  .EndpointsPage__entryTitle 新しい管理画面を<br />作成する
  .EndpointsPage__entryMessage(if="{ isExist }") そのエンドポイントは既に登録済みです。
  .EndpointsPage__entryForm
    dmc-textinput(text="{ endpointURL }" placeholder="https://localhost:3000/swagger.json" onChange="{ handleEndpointURLChange }")
    dmc-textarea(text="{ memo }" placeholder="Writing..." maxlength="20" onChange="{ handleMemoChange }")
  .EndpointsPage__entryControls
    dmc-button(type="primary" isDisabled="{ isExist }" onPat="{ handleRegisterButtonPat }" label="新規作成")
    dmc-button(type="secondary" onPat="{ handleCancelButtonPat }" label="キャンセル")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-textarea/index.tag';
    import script from './entry';
    this.external(script);
