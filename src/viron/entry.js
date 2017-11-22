export default function() {
  const store = this.riotx.get();

  this.isExist = false;
  this.endpointURL = '';
  this.memo = '';

  this.handleEndpointURLChange = newEndpointURL => {
    this.endpointURL = newEndpointURL;
    this.isExist = !!store.getter('endpoints.oneByURL', newEndpointURL);
    this.update();
  };

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleRegisterButtonClick = () => {
    Promise
      .resolve()
      .then(() => store.action('endpoints.add', this.endpointURL, this.memo))
      .then(() => store.action('toasts.add', {
        message: 'エンドポイントを追加しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => {
        let autoHide = true;
        let linkText;
        let link;
        // サーバが自己証明書を使用している場合にページ遷移を促す。
        if (this.endpointURL.startsWith('https://')) {
          autoHide = false;
          linkText = 'Self-Signed Certificate?';
          link = this.endpointURL;
        }
        store.action('toasts.add', {
          message: err.message,
          autoHide,
          linkText,
          link
        });
      });
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
}
