viron-endpoints-page-endpoint-signin.EndpointsPage_Endpoint_Signin
  .EndpointsPage_Endpoint_Signin__main
    virtual(if="{ !!opts.endpoint.thumbnail }")
      .EndpointsPage_Endpoint_Signin__thumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    virtual(if="{ !opts.endpoint.thumbnail }")
      .EndpointsPage_Endpoint_Signin__thumbnailDefault
        viron-icon-star
    .EndpointsPage_Endpoint_Signin__name { opts.endpoint.name || '- - -' }
    .EndpointsPage_Endpoint_Signin__emails(if="{ !!emails.length }")
      viron-endpoints-page-endpoint-signin-email(each="{ authtype in emails }" authtype="{ authtype }" endpointKey="{ parent.opts.endpoint.key }" closer="{ closer }")
    virtual(if="{ !isDesktop && !!oauths.length }")
      viron-horizontal-rule(label="または")
      .EndpointsPage_Endpoint_Signin__oauths.EndpointsPage_Endpoint_Signin__oauths--centered
        viron-endpoints-page-endpoint-signin-oauth(each="{ authtype in oauths }" authtype="{ authtype }" endpointKey="{ parent.opts.endpoint.key }" closer="{ closer }")
  .EndpointsPage_Endpoint_Signin__aside(if="{ isDesktop && !!oauths.length }")
    .EndpointsPage_Endpoint_Signin__oauthMessage
      | または、こちらを
      br
      | 利用してログイン
    .EndpointsPage_Endpoint_Signin__oauths
      viron-endpoints-page-endpoint-signin-oauth(each="{ authtype in oauths }" authtype="{ authtype }" endpointKey="{ parent.opts.endpoint.key }" closer="{ closer }")

  script.
    import '../../../../components/viron-horizontal-rule/index.tag';
    import '../../../../components/icons/viron-icon-star/index.tag';
    import './email/index.tag';
    import './oauth/index.tag';
    import script from './index';
    this.external(script);
