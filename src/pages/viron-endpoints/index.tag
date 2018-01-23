viron-endpoints-page.EndpointsPage(class="EndpointsPage--{ layoutType }")
  .EndpointsPage__head
    .EndpointsPage__title ホーム
  .EndpointsPage__container
    viron-endpoints-page-endpoint(each="{ endpoint in endpoints }" endpoint="{ endpoint }" isDraggable="{ true }")
    viron-endpoints-page-add

  script.
    import './add/index.tag';
    import './endpoint/index.tag';
    import script from './index';
    this.external(script);
