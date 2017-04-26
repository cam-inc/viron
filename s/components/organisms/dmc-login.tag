dmc-login
  div ログイン
  div userID is { userID }
  div password is { password }
  div(click="{ handleLoginButtonClick }") [login]
  div(click="{ handleCancelButtonClick }") [cancel]

  script.
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
