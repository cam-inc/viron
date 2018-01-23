viron-endpoints-page-endpoint-signin-oauth.EndpointsPage_Endpoint_Signin_Oauth
  .EndpointsPage_Endpoint_Signin_Oauth__button(onTap="{ handleButtonTap }")
    .EndpointsPage_Endpoint_Signin_Oauth__google(if="{ isGoogle }")
    .EndpointsPage_Endpoint_Signin_Oauth__label { label }

  script.
    import script from './index';
    this.external(script);
