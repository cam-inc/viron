dmc-endpoints.Page.EndpointsPage
  .EndpointsPage__caption(if="{ !!endpointsCount }")
    .EndpointsPage__captionIcon
      dmc-icon(type="link")
    .EndpointsPage__captionLabel Endpoint ({ endpointsCount })
      span.EndpointsPage__captionFilter(if="{ !!endpointFilterText }") filtered by "{ endpointFilterText }"
  .EndpointsPage__list(ref="list")
    virtual(each="{ endpoint in endpoints }")
      dmc-endpoint(
        key="{ endpoint.key }"
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
