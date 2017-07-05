dmc-endpoints.Page.EndpointsPage
  .EndpointsPage__list
    .EndpointsPage__addCard(ref="touch" onTap="handleEndpointAddTap")
      dmc-icon(type="plus")
    virtual(each="{ endpoint, key in endpoints }")
      dmc-endpoint(
        key="{ key }"
        name="{ endpoint.name }"
        thumbnail="{ endpoint.thumbnail }"
        token="{ endpoint.token }"
        url="{ endpoint.url }"
        description="{ endpoint.description }"
        memo="{ endpoint.memo }"
        tags="{ endpoint.tags }"
        onEntry="{ handleEndpointEntry }"
        onEdit="{ handleEndpointEdit }"
        onRemove="{ handleEndpointRemove }"
        onLogout="{ handleEndpointLogout }"
      )

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './endpoint.tag';
    import script from './index';
    this.external(script);
