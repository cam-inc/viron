dmc-endpoint-signin.EndpointsPage__signin
  .EndpointsPage__signinHead
    .EndpointsPage__signinThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    .EndpointsPage__signinName { opts.endpoint.name }
  .EndpointsPage__signinEmails(if="{ !!emails.length }")
    .EndpointsPage__signinEmailsTitle メールアドレス認証
    virtual(each="{ authtype in emails }")
      dmc-signinemail(authtype="{ authtype }" onSigninPat="{ parent.handleEmailSigninPat }")
  .EndpointsPage__signinOauths(if="{ !!oauths.length }")
    .EndpointsPage__signinOauthsTitle OAuth認証
    virtual(each="{ authtype in oauths }")
      dmc-signinoauth(authtype="{ authtype }" onPat="{ parent.handleOAuthPat }")

  script.
    import './signinemail.tag';
    import './signinoauth.tag';
    import script from './signin';
    this.external(script);
