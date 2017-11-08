viron-signinemail.EndpointsPage__signinEmail
  viron-textinput(label="メールアドレス" text="{ email }" type="email" onChange="{ handleEmailChange }")
  viron-textinput(label="パスワード" text="{ password }" type="password" onChange="{ handlePasswordChange }")
  viron-button(onClick="{ handleSigninClick }" label="サインイン")

  script.
    import '../../atoms/viron-button/index.tag';
    import '../../atoms/viron-textinput/index.tag';
    import script from './signinemail';
    this.external(script);
