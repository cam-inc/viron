dmc-signinemail.EndpointsPage__signinEmail
  dmc-textinput(label="メールアドレス" text="{ email }" type="email" onChange="{ handleEmailChange }")
  dmc-textinput(label="パスワード" text="{ password }" type="password" onChange="{ handlePasswordChange }")
  dmc-button(onPat="{ handleSigninPat }" label="サインイン")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import script from './signinemail';
    this.external(script);
