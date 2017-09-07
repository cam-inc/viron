dmc-application-confirm.Application__confirm
  .Application__confirmHead
    .Application__confirmTitle エンドポイント削除
    .Application__confirmDescription 全てのエンドポイントが削除されます。個別に削除したい場合は各エンドポイントカード内の削除ボタンから行って下さい。
  .Application__confirmTail
    dmc-button(label="全て削除する" type="emphasis" onPat="{ handleDeleteButtonPat }")
    dmc-button(label="キャンセル" onPat="{ handleCancelButtonPat }")

  script.
    import script from './confirm';
    this.external(script);
