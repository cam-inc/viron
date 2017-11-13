viron-endpoints-page-endpoint.card.EndpointsPage_Endpoint
  .EndpointsPage_Endpoint__menu(ref="menu" onTap="{ handleMenuTap }")
    viron-icon-dots
  .EndpointsPage_Endpoint__thumbnail { opts.endpoint.thumbnail }
  .EndpointsPage_Endpoint__name name: { opts.endpoint.name }
  .EndpointsPage_Endpoint__description description: { opts.endpoint.description }
  .EndpointsPage_Endpoint__url url: { opts.endpoint.url }
  .EndpointsPage_Endpoint__version { opts.endpoint.thumbnail }
  .EndpointsPage_Endpoint__token token: { opts.endpoint.token }
  .EndpointsPage_Endpoint__theme theme: { opts.endpoint.color }
  .EndpointsPage_Endpoint__tags
    viron-tag(each="{ tag in opts.endpoint.tags }" label="{ tag }")

  script.
    import '../../../components/viron-tag/index.tag';
    import '../../../components/icons/viron-icon-dots/index.tag';
    import script from './index';
    this.external(script);
