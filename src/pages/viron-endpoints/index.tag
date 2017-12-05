viron-endpoints-page.EndpointsPage
  .EndpointsPage__head
    .EndpointsPage__title ホーム
    .EndpointsPage__orderButton(if="{ isDesktop }" onTap="{ handleOrderButtonTap }")
      viron-icon-move
  .EndpointsPage__container
    viron-endpoints-page-endpoint(each="{ endpoint in endpoints }" endpoint="{ endpoint }")

  script.
    import '../../components/icons/viron-icon-move/index.tag';
    import './endpoint/index.tag';
    import script from './index';
    this.external(script);
