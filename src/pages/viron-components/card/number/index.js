import isNumber from 'mout/lang/isNumber';
import currencyFormat from 'mout/number/currencyFormat';

export default function() {
  const store = this.riotx.get();

  /**
   * OASに従いGETリクエストを送信します。
   * @return {Promise}
   */
  const getData = () => {
    return Promise
      .resolve()
      .then(() => {
        this.isLoading = true;
        this.update();
      })
      .then(() => store.action('components.get', this.opts.id, this.opts.def))
      .then(() => {
        this.isLoading = false;
        this.update();
      })
      .catch(err => {
        this.isLoading = false;
        if (err.status === 401) {
          this.error = '認証エラー。';
        } else {
          const api = this.opts.def.api;
          this.error = `[${api.method.toUpperCase()} ${api.path}]通信に失敗しました。`;
        }
        this.update();
      });
  };

  /**
   * レスポンスデータの正当性をチェックします。
   * @param {Object} data
   * @return {String|null}
   */
  const validate = data => {
    if (!data) {
      return 'TODO: エラーメッセージ';
    }
    if (!isNumber(data.value)) {
      return 'TODO: エラーメッセージ';
    }
    return null;
  };

  // 通信レスポンス内容。
  this.data = null;
  // 通信中か否か。
  this.isLoading = true;
  // エラーメッセージ。
  this.error = null;
  // 1000桁毎にカンマを付けた値を返します。
  this.getValue = () => {
    return currencyFormat(this.data.value, 0);
  };

  this.listen(this.opts.id, () => {
    this.data = store.getter('components.response', this.opts.id);
    this.error = validate(this.data);
    this.update();
  });

  this.on('mount', () => {
    getData();
  }).on('unmount', () => {
    store.action('components.remove', this.opts.id);
  });

  this.handleRefreshButtonTap = () => {
    getData();
  };
}
