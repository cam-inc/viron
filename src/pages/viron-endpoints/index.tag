viron-endpoints-page.EndpointsPage(class="EndpointsPage--{ layoutType }")
  .EndpointsPage__head
    .EndpointsPage__title ホーム
    .EndpointsPage__orderButton(if="{ isDesktop }" class="{ 'EndpointsPage__orderButton--active': isDraggable }" onTap="{ handleOrderButtonTap }")
      viron-icon-move
  .EndpointsPage__container
    viron-jsonviewer(if="{ json }" json="{ json }")
    //- viron-endpoints-page-endpoint(each="{ endpoint in endpoints }" endpoint="{ endpoint }" isDraggable="{ parent.isDraggable }")

  script.
    import '../../components/icons/viron-icon-move/index.tag';
    import '../../components/viron-jsonviewer/index.tag';
    import '../../components/viron-image/index.tag';
    import './endpoint/index.tag';
    import script from './index';
    this.external(script);
