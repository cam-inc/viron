import filter from 'mout/object/filter';
import values from 'mout/object/values';
import '../../atoms/viron-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.oauths = values(filter(this.opts.authtypes, v => {
    return v.type === 'oauth';
  }));
  this.emails = values(filter(this.opts.authtypes, v => {
    return v.type === 'email';
  }));

  this.handleEmailSigninClick = (email, password, authtype) => {
    Promise
      .resolve()
      .then(() => store.action('auth.signinEmail', this.opts.key, authtype, email, password))
      .then(() => {
        this.close();
        this.opts.onSignin();
      })
      .catch(err => store.action('modals.add', 'viron-message', {
        title: 'ログイン失敗',
        message: 'ログイン出来ませんでした。正しいメールアドレスとパスワードを使用しているか確認して下さい。使用したメールアドレスが予め管理者として登録されているか確認して下さい。',
        error: err
      }));
  };

  this.handleOAuthClick = authtype => {
    Promise
      .resolve()
      .then(() => store.action('auth.signinOAuth', this.opts.key, authtype))
      .catch(err => store.action('modals.add', 'viron-message', {
        error: err
      }));
  };
}
