dmc-entry
  //- エンドポイント登録
  div
    div.field
      label.__label Endpoint URL
      input.__input(ref="url" type='text' value="http://127.0.0.1:3000/swagger.json" pattern="https?://[\w/:%#\$&\?\(\)~\.=\+\-]+"
        placeholder="https://example.com/swagger.json"
        disabled=false
        autofocus=true
        )
    div.field
      label.__label Memo ...
      textarea.__input(ref="memo" cols="40" rows="4" maxlength="20" placeholder="Writing....")
        | ローカル API

    input.__input.__button(type='button' onclick="{ handleRegisterButtonClick }" value="Register")
    input.__input.__button(type='button' onclick="{ handleCancelButtonClick }" value="Cancel")

  br
  br
  br



  div ログイン
  div userID is { userID }
  div password is { password }
  div(click="{ handleLoginButtonClick }") [login]
  div(click="{ handleCancelButtonClick }") [cancel]

  style.
    .field {
      border: 1px solid gray;
      margin-bottom: 12px;
    }
    .__button {
      border: 1px solid gray;
      margin-bottom: 12px;
    }

  script.
    import constants from '../../core/constants';
    const store = this.riotx.get();

    store.change(constants.CHANGE_ENDPOINT, (err, state, store) => {
      this.closeModal();
    });


    // Event: Endpoint 登録
    this.handleRegisterButtonClick = (ev) => {
      store.action(constants.ACTION_ENDPOINT_ADD, this.refs.url.value, this.refs.memo.value);
    }


    this.userID = 'userID';
    this.password = 'password';

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleLoginButtonClick() {
      Promise
        .resolve()
        .then(() => {
          // TODO: call action to login.
          // return store.action(constants.ACTION_ENDPOINT_LOGIN, this.userID, this.password);
        })
        .then(() => {
          this.opts.onLogin();
          this.closeModal();
        });
    }

    handleCancelButtonClick() {
      this.closeModal();
    }
