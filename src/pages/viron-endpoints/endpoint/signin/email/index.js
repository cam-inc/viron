export default function() {
  const store = this.riotx.get();

  this.errorMessage = null;
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

  this.handleFromSubmit = () => {
    signin();
  };

  this.handleSigninButtonSelect = () => {
    signin();
  };

  const signin = () => {
    Promise
      .resolve()
      .then(() => store.action('auth.signinEmail', this.opts.endpointkey, this.opts.authtype, this.mailAddress, this.password))
      .then(() => {
        this.opts.closer();
        this.getRouter().navigateTo(`/${this.opts.endpointkey}`);
      })
      .catch(() => {
        this.errorMessage = 'ログイン出来ませんでした。正しいメールアドレスとパスワードを使用しているか確認して下さい。使用したメールアドレスが予め管理者として登録されているか確認して下さい。';
        this.update();
      });
  };
}
