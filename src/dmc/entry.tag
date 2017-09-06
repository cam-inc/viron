dmc-entry.Application__entry
  .Application__entryTitle 新しい管理画面を作成する
  .Application__entryMessage(if="{ isExist }") そのエンドポイントは既に登録済みです。
  .Application__entryForm
    dmc-textinput(label="エンドポイント" text="{ endpointURL }" onChange="{ handleEndpointURLChange }")
    dmc-textarea(label="メモ" text="{ memo }" onChange="{ handleMemoChange }")
  .Application__entryControls
    dmc-button(type="primary" isDisabled="{ isExist }" onPat="{ handleRegisterButtonPat }" label="新規作成")
    dmc-button(type="secondary" onPat="{ handleCancelButtonPat }" label="キャンセル")

  script.
    import '../components/atoms/dmc-button/index.tag';
    import '../components/atoms/dmc-textinput/index.tag';
    import '../components/atoms/dmc-textarea/index.tag';
    import script from './entry';
    this.external(script);
