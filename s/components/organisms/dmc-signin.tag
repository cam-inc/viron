dmc-signin
  h1 { opts.key }

  pre { JSON.stringify(opts.endpoint, null, '    ') }

  hr

  div.__email(each="{ authtype, idx in emails }")
    h2 { authtype.provider }
    input.__field(ref="email_{idx}" type="email" placeholder="e-mail" value="fkei@example.com")
    input.__field(ref="password_{idx}" type="password" value="1234567890")
    input.__button(type="button" value="Sing In" onclick="{ handleSignInEMail }" data-idx="{ idx }")

    hr

  div.__oauth(each="{ authtype in oauths }")
    input.__button(type="button" value="{ authtype.provider } Auth" onclick="{ handleSignInOAuth }")
    hr

  style.
    .__field {
      border: 1px solid gray;
      margin-bottom: 12px;
    }

    .__button {
      border: 1px solid gray;
      margin-bottom: 12px;
    }

  script.
    import { filter, values } from 'mout/object';
    import constants from '../../core/constants';
    const store = this.riotx.get();

    this.oauths = values(filter(this.opts.authtype, v => {
      return v.type === constants.AUTH_TYPE_OAUTH;
    }));

    this.emails = values(filter(this.opts.authtype, v => {
      return v.type === constants.AUTH_TYPE_EMAIL;
    }));

    this.closeModal = () => {
      if (this.opts.isModal) {
        this.opts.modalCloser();
      }
    }

    this.handleSignInEMail = (ev) => {
      const idx = parseInt(ev.currentTarget.getAttribute('data-idx'));
      const email = this.refs[`email_${idx}`].value;
      const password = this.refs[`password_${idx}`].value;
      store.action(constants.ACTION_AUTH_SIGN_IN_EMAIL, this.opts.key, ev.item.authtype, email, password)
        .then(() => {
          this.closeModal();
          this.opts.onSignIn();
        })
        .catch((err) => {
          // TODO SingIn 失敗通知
          debugger;
        })
      ;
    }

    this.handleSignInOAuth = (ev) => {
      store.action(constants.ACTION_AUTH_SIGN_IN_GOOGLE, this.opts.key, ev.item.authtype);
    }


