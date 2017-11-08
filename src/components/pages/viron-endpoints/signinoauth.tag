viron-signinoauth.EndpointsPage__signinOauth
  viron-button(onClick="{ handleButtonClick }" label="{ opts.authtype.provider }")

  script.
    import '../../atoms/viron-button/index.tag';
    import script from './signinoauth';
    this.external(script);
