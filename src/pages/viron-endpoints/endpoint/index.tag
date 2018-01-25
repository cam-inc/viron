viron-endpoints-page-endpoint.EndpointsPage_Endpoint(draggable="{ opts.isdraggable }" onDragStart="{ handleDragStart }" onDrag="{ handleDrag }" onDragEnd="{ handleDragEnd }" onTap="{ handleTap }")
  .EndpointsPage_Endpoint__dropareaMarker.EndpointsPage_Endpoint__dropareaMarker--prev(class="{ 'EndpointsPage_Endpoint__dropareaMarker--active': isPrevDroppable }")
  .EndpointsPage_Endpoint__content
    .EndpointsPage_Endpoint__head
      virtual(if="{ !!opts.endpoint.thumbnail }")
        .EndpointsPage_Endpoint__thumbnail(style="background-image:url({ opts.endpoint.thumbnail });")
      virtual(if="{ !opts.endpoint.thumbnail }")
        .EndpointsPage_Endpoint__thumbnailDefault
          viron-icon-star
      .EndpointsPage_Endpoint__headContent
        .EndpointsPage_Endpoint__name { opts.endpoint.name || '- - -' }
        .EndpointsPage_Endpoint__urlWrapper
          .EndpointsPage_Endpoint__color(class="EndpointsPage_Endpoint__color--{ opts.endpoint.color || 'blue' }")
          .EndpointsPage_Endpoint__url { opts.endpoint.url }
      viron-icon-setting.EndpointsPage_Endpoint__menu(ref="menu" onTap="{ handleMenuTap }")
    .EndpointsPage_Endpoint__body
      // thumbnailが存在したら過去に一度でもサインインしたと判断。
      .EndpointsPage_Endpoint__description { !!opts.endpoint.thumbnail ? (opts.endpoint.description || '-') : 'ログインで管理画面情報を取得できます' }
      .EndpointsPage_Endpoint__tags
        viron-tag(each="{ tag in opts.endpoint.tags }" label="{ tag }")
    .EndpointsPage_Endpoint__droparea.EndpointsPage_Endpoint__droparea--prev(if="{ isDragging && !isSelfDragged }" onDragEnter="{ handlePrevDragEnter }" onDragOver="{ handlePrevDragOver }" onDragLeave="{ handlePrevDragLeave }" onDrop="{ handlePrevDrop }")
    .EndpointsPage_Endpoint__droparea.EndpointsPage_Endpoint__droparea--next(if="{ isDragging && !isSelfDragged }" onDragEnter="{ handleNextDragEnter }" onDragOver="{ handleNextDragOver }" onDragLeave="{ handleNextDragLeave }" onDrop="{ handleNextDrop }")
  .EndpointsPage_Endpoint__dropareaMarker.EndpointsPage_Endpoint__dropareaMarker--next(class="{ 'EndpointsPage_Endpoint__dropareaMarker--active': isNextDroppable }")

  script.
    import '../../../components/viron-tag/index.tag';
    import '../../../components/icons/viron-icon-setting/index.tag';
    import '../../../components/icons/viron-icon-star/index.tag';
    import script from './index';
    this.external(script);
