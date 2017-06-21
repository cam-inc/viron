dmc-signin.EndpointsPage__signin
  .EndpointsPage__signinTitle サインイン
  .EndpointsPage__signinEmails(if="{ !!emails.length }")
    virtual(each="{ authtype in emails }")
      dmc-signinemail(authtype="{ authtype }" onSigninPat="{ parent.handleEmailSigninPat }")
  .EndpointsPage__signinOauths(if="{ !!oauths.length }")
    virtual(each="{ authtype in oauths }")
      dmc-signinoauth(authtype="{ authtype }" onPat="{ parent.handleOAuthPat }")

  script.
    import './signinemail.tag';
    import './signinoauth.tag';
    import script from './signin';
    this.external(script);
