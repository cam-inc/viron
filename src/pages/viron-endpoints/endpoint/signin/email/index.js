import { constants as actions } from '../../../../../store/actions';
import '../../../../../components/viron-error/index.tag';

export default function() {
  const store = this.riotx.get();

  this.mailAddress = '';
  this.password = '';

  this.handleMailAddressChange = newMailAddress => {
    this.mailAddress = newMailAddress;
    this.update();
  };

  this.handlePasswordChange = newPassword => {
    this.password = newPassword;
    this.update();
  };

  this.handleSigninButtonSelect = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action(actions.AUTH_SIGNIN_EMAIL, this.opts.endpointkey, this.opts.authtype, this.mailAddress, this.password))
      .then(() => {
        this.getRouter().navigateTo(`/${this.opts.endpointkey}`);
      })
      .catch(err => store.action(actions.MODALS_ADD, 'viron-error', {
        title: 'ログイン失敗',
        message: 'ログイン出来ませんでした。正しいメールアドレスとパスワードを使用しているか確認して下さい。使用したメールアドレスが予め管理者として登録されているか確認して下さい。',
        error: err
      }));
  };
}
