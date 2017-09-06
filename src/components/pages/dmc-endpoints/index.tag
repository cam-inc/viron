dmc-endpoints.Page.EndpointsPage
  .EndpointsPage__count(if="{ !!endpointsCount }")
    .EndpointsPage__countIcon
      dmc-icon(type="link")
    .EndpointsPage__countLabel Endpoint ({ endpointsCount })
  .EndpointsPage__list(ref="list")
    virtual(each="{ endpoint, key in endpoints }")
      dmc-endpoint(
        key="{ key }"
        endpoint="{ endpoint }"
        onEntry="{ handleEndpointEntry }"
        onEdit="{ handleEndpointEdit }"
        onRemove="{ handleEndpointRemove }"
        onQrCode="{ handleEndpointQrCode }"
        onLogout="{ handleEndpointLogout }"
      )

  script.
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-uploader/index.tag';
    import './endpoint.tag';
    import script from './index';
    this.external(script);
