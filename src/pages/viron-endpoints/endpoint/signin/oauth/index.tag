viron-endpoints-page-endpoint-signin-oauth.EndpointsPage_Endpoint_Signin_Oauth
  viron-button(label="{ opts.authtype.provider }" theme="secondary" onSelect="{ handleButtonSelect }")

  script.
    import '../../../../../components/viron-button/index.tag';
    import script from './index';
    this.external(script);
