dmc-entry.Entry
  .Entry__title 新しい管理画面を<br />作成する
  .Entry__message(if="{ isExist }") そのエンドポイントは既に登録済みです。
  .Entry__form
    dmc-input(text="{ endpointURL }" placeholder="https://localhost:3000/swagger.json" pattern="https?://[\w/:%#\$&\?\(\)~\.=\+\-]+" onTextChange="{ handleEndpointURLChange }")
    dmc-textarea(text="{ memo }" placeholder="Writing..." maxlength="20" onTextChange="{ handleMemoChange }")
  .Entry__controls
    dmc-button(type="primary" isDisabled="{ isExist }" onClick="{ handleRegisterButtonClick }" label="新規作成")
    dmc-button(type="secondary" onClick="{ handleCancelButtonClick }" label="キャンセル")
  script.
    import constants from '../../core/constants';
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-input.tag';
    import '../atoms/dmc-textarea.tag';

    const store = this.riotx.get();


    this.endpointURL = '';
    this.isExist = false;
    this.memo = '';

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleEndpointURLChange(endpointURL) {
      this.endpointURL = endpointURL;
      this.isExist = !!store.getter(constants.GETTER_ENDPOINTS_ONE_BY_URL, endpointURL);
      this.update();
    }

    handleMemoChange(memo) {
      this.memo = memo;
      this.update();
    }

    // TODO: 上書きの場合は、そもそも登録ボタンを押せなくする
    handleRegisterButtonClick() {
      store.action(constants.ACTION_ENDPOINTS_ADD, this.endpointURL, this.memo)
      .then(() => {
        this.closeModal();
      }).catch(err => {
        let autoHide = true;
        let linkText;
        let link;
        // サーバが自己証明書を使用している場合にページ遷移を促す。
        if (this.endpointURL.startsWith('https://')) {
          autoHide = false;
          linkText = 'Self-Signed Certificate?';
          link = this.endpointURL;
        }
        store.action(constants.ACTION_TOAST_SHOW, {
          message: err.message,
          autoHide,
          linkText,
          link
        });
      })
    }

    handleCancelButtonClick() {
      this.closeModal();
    }
