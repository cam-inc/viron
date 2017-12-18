viron-endpoints-page.EndpointsPage(class="EndpointsPage--{ layoutType }")
  .EndpointsPage__head
    .EndpointsPage__title ホーム
    // 常にDnd可能な状態にしておく。
    //.EndpointsPage__orderButton(if="{ isDesktop }" onTap="{ handleOrderButtonTap }")
      //viron-icon-move(if="{ !isDraggable }")
      //viron-icon-check(if="{ isDraggable }")
  .EndpointsPage__container
    viron-endpoints-page-endpoint(each="{ endpoint in endpoints }" endpoint="{ endpoint }" isDraggable="{ parent.isDraggable }")

  script.
    import '../../components/icons/viron-icon-move/index.tag';
    import './endpoint/index.tag';
    import script from './index';
    this.external(script);
