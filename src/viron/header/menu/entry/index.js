import urlValidator from 'valid-url';
import i18n from '../../../../core/i18n';

export default function() {
  const store = this.riotx.get();

  this.endpointURL = '';
  // エラーメッセージ。
  this.errorMessage = '';
  // 自己署名証明書を使用している可能性があるか否か。
  this.isLikelyToBeSelfSignedCertificate = false;

  /**
   * 追加可能なエンドポイントが確認します。エラーがある場合はエラー文言を返します。
   * @param {String} endpointURL
   * @return {String|null}
   */
  const validate = endpointURL => {
    // URL値が不正。
    if (!urlValidator.isUri(endpointURL)) {
      return i18n.get('header_menu_entry_error_url');
    }
    // 重複チェック。
    if (!!store.getter('endpoints.oneByURL', endpointURL)) {
      return i18n.get('header_menu_entry_error_overlapping');
    }
    return null;
  };

  this.handleEndpointURLChange = newEndpointURL => {
    this.endpointURL = newEndpointURL;
    this.update();
  };

  this.handleSelfSignedCertificateButtonTap = () => {
    window.open(this.endpointURL, '_blank');
  };

  this.handleFormSubmit = newEndpointURL => {
    this.registerEndpoint(newEndpointURL);
  };

  this.handleAddButtonSelect = () => {
    this.registerEndpoint();
  };

  this.registerEndpoint = newEndpointURL => {
    // エラーチェック。
    const errorMessage = validate(newEndpointURL || this.endpointURL);
    if (!!errorMessage) {
      this.errorMessage = errorMessage;
      this.isLikelyToBeSelfSignedCertificate = false;
      this.update();
      return;
    }

    Promise
      .resolve()
      .then(() => store.action('endpoints.add', this.endpointURL))
      .then(() => store.action('toasts.add', {
        message: i18n.get('header_menu_entry_info')
      }))
      .then(() => {
        this.close();
      })
      .catch(err => {
        switch (err.status) {
        case 404:
          this.errorMessage = i18n.get('header_menu_entry_error_notfound');
          break;
        default:
          this.errorMessage = i18n.get('header_menu_entry_error');
          break;
        }
        // サーバが自己証明書を使用している場合にページ遷移を促す。
        if (this.endpointURL.startsWith('https://')) {
          this.isLikelyToBeSelfSignedCertificate = true;
        } else {
          this.isLikelyToBeSelfSignedCertificate = false;
        }
        this.update();
      });
  };
}
