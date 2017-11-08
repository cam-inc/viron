viron-application-entry.Application__entry
  .Application__entryTitle 新しい管理画面を作成する
  .Application__entryMessage(if="{ isExist }") そのエンドポイントは既に登録済みです。
  .Application__entryForm
    viron-textinput(label="エンドポイント" text="{ endpointURL }" onChange="{ handleEndpointURLChange }")
    viron-textarea(label="メモ" text="{ memo }" onChange="{ handleMemoChange }")
  .Application__entryControls
    viron-button(type="primary" isDisabled="{ isExist }" onPpat="{ handleRegisterButtonPpat }" label="新規作成")
    viron-button(type="secondary" onPpat="{ handleCancelButtonPpat }" label="キャンセル")

  script.
    import '../components/atoms/viron-button/index.tag';
    import '../components/atoms/viron-textinput/index.tag';
    import '../components/atoms/viron-textarea/index.tag';
    import script from './entry';
    this.external(script);
