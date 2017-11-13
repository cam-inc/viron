viron-endpoints-page.EndpointsPage
  .EndpointsPage__list
    viron-endpoints-page-endpoint(each="{ endpoint in endpoints }" endpoint="{ endpoint }")

  script.
    import './endpoint/index.tag';
    import script from './index';
    this.external(script);
