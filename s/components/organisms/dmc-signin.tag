dmc-signin.Signin
  .Signin__title サインイン
  .Signin__endpointTitle { opts.endpoint.title }
  .Signin__emails(if="{ !!emails.length }")
    virtual(each="{ authtype in emails}")
      dmc-signinemail(authtype="{ authtype }" onSigninClick="{ parent.handleEmailSigninClick }")
  .Signin__oauths(if="{ !!oauths.length }")
    virtual(each="{ authtype in oauths }")
      dmc-signinoauth(authtype="{ authtype }" onClick="{ parent.handleOAuthClick }")

  script.
    import { filter, values } from 'mout/object';
    import constants from '../../core/constants';

    const store = this.riotx.get();

    this.oauths = values(filter(this.opts.authtypes, v => {
      return v.type === constants.AUTH_TYPE_OAUTH;
    }));

    this.emails = values(filter(this.opts.authtypes, v => {
      return v.type === constants.AUTH_TYPE_EMAIL;
    }));

    closeModal() {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    handleEmailSigninClick(email, password, authtype) {
      store
        .action(constants.ACTION_AUTH_SIGN_IN_EMAIL, this.opts.key, authtype, email, password)
        .then(() => {
          this.closeModal();
          this.opts.onSignIn();
        })
        .catch(err => {
          store.action(constants.ACTION_TOAST_SHOW, {
            message: err.message
          });
        })
      ;
    }

    handleOAuthClick(authtype) {
      store.action(constants.ACTION_AUTH_SIGN_IN_GOOGLE, this.opts.key, authtype);
    }

dmc-signinemail.Signin__email
  dmc-input(text="{ email }" type="email" placeholder="e-mail" onTextChange="{ handleEmailChange }")
  dmc-input(text="{ password }" type="password" placeholder="password" onTextChange="{ handlePasswordChange }")
  dmc-button(onClick="{ handleSigninClick }" label="サインイン")

  script.
    import '../atoms/dmc-button.tag';
    import '../atoms/dmc-input.tag';

    this.email = 'fkei@example.com';
    this.password = '1234567890';

    handleEmailChange(email) {
      this.email = email;
      this.update();
    }

    handlePasswordChange(password) {
      this.password = password;
      this.update();
    }

    handleSigninClick() {
      this.opts.onsigninclick(this.email, this.password, this.opts.authtype);
    }

dmc-signinoauth.Signin__oauth
  dmc-button(onClick="{ handleButtonClick }" label="{ opts.authtype.provider }")

  script.
    import '../atoms/dmc-button.tag';

    handleButtonClick() {
      this.opts.onclick(this.opts.authtype);
    }
