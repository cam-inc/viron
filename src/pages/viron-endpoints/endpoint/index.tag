viron-endpoints-page-endpoint.card.EndpointsPage_Endpoint(onTap="{ handleTap }")
  .EndpointsPage_Endpoint__head
    .EndpointsPage_Endpoint__thumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
    .EndpointsPage_Endpoint__headContent
      .EndpointsPage_Endpoint__name { opts.endpoint.name }
      .EndpointsPage_Endpoint__url url: { opts.endpoint.url }
    viron-icon-dots.EndpointsPage_Endpoint__menu(ref="menu" onTap="{ handleMenuTap }")
  .EndpointsPage_Endpoint__body
    .EndpointsPage_Endpoint__description description: { opts.endpoint.description }
    .EndpointsPage_Endpoint__tags
      viron-tag(each="{ tag in opts.endpoint.tags }" label="{ tag }")

  script.
    import '../../../components/viron-tag/index.tag';
    import '../../../components/icons/viron-icon-dots/index.tag';
    import script from './index';
    this.external(script);
