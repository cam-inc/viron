viron-endpoints-page-endpoint-signin-oauth.EndpointsPage_Endpoint_Signin_Oauth
  virtual(if="{ isGoogle }")
    .EndpointsPage_Endpoint_Signin_Oauth__googleButton(class="{ 'EndpointsPage_Endpoint_Signin_Oauth__googleButton--large': isMobile }" onTap="{ handleButtonTap }")
  virtual(if="{ isFacebook }")
    .EndpointsPage_Endpoint_Signin_Oauth__facebookButton(class="{ 'EndpointsPage_Endpoint_Signin_Oauth__facebookButton--large': isMobile }" onTap="{ handleButtonTap }")
  virtual(if="{ !isGoogle && !isFacebook }")
    .EndpointsPage_Endpoint_Signin_Oauth__button(onTap="{ handleButtonTap }")
      .EndpointsPage_Endpoint_Signin_Oauth__label { label }

  script.
    import script from './index';
    this.external(script);
