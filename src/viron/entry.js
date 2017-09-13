import { constants as actions } from '../store/actions';
import { constants as getters } from '../store/getters';

export default function() {
  const store = this.riotx.get();

  this.isExist = false;
  this.endpointURL = '';
  this.memo = '';

  this.handleEndpointURLChange = newEndpointURL => {
    this.endpointURL = newEndpointURL;
    this.isExist = !!store.getter(getters.ENDPOINTS_ONE_BY_URL, newEndpointURL);
    this.update();
  };

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleRegisterButtonPat = () => {
    Promise
      .resolve()
      .then(() => store.action(actions.ENDPOINTS_ADD, this.endpointURL, this.memo))
      .then(() => store.action(actions.TOASTS_ADD, {
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
        store.action(actions.TOASTS_ADD, {
          message: err.message,
          autoHide,
          linkText,
          link
        });
      });
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
