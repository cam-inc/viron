viron-endpoint-signin.EndpointsPage__signin
  .EndpointsPage__signinHead
    .EndpointsPage__signinThumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    .EndpointsPage__signinName { opts.endpoint.name }
  .EndpointsPage__signinEmails(if="{ !!emails.length }")
    .EndpointsPage__signinEmailsTitle メールアドレス認証
    virtual(each="{ authtype in emails }")
      viron-signinemail(authtype="{ authtype }" onSigninClick="{ parent.handleEmailSigninClick }")
  .EndpointsPage__signinOauths(if="{ !!oauths.length }")
    .EndpointsPage__signinOauthsTitle OAuth認証
    virtual(each="{ authtype in oauths }")
      viron-signinoauth(authtype="{ authtype }" onClick="{ parent.handleOAuthClick }")

  script.
    import './signinemail.tag';
    import './signinoauth.tag';
    import script from './signin';
    this.external(script);
