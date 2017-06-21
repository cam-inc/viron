dmc-signinoauth.EndpointsPage__signinOauth
  dmc-button(onPat="{ handleButtonPat }" label="{ opts.authtype.provider }")

  script.
    import '../../atoms/dmc-button/index.tag';
    import script from './signinoauth';
    this.external(script);
