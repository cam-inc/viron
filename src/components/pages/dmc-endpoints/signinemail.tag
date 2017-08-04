dmc-signinemail.EndpointsPage__signinEmail
  dmc-textinput(label="メールアドレス" text="{ email }" type="email" placeholder="Email" onChange="{ handleEmailChange }")
  dmc-textinput(label="パスワード" text="{ password }" type="password" placeholder="Password" onChange="{ handlePasswordChange }")
  dmc-datepicker(label="日付" text="{ date }" placeholder="date")
  dmc-button(onPat="{ handleSigninPat }" label="サインイン")

  script.
    import '../../atoms/dmc-button/index.tag';
    import '../../atoms/dmc-textinput/index.tag';
    import '../../atoms/dmc-datepicker/index.tag';
    import script from './signinemail';
    this.external(script);
