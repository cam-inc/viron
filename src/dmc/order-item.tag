dmc-application-order-item.Application__orderItem(draggable="{ true }" onDragStart="{ handleDragStart }" onDrag="{ handleDrag }" onDragEnd="{ handleDragEnd }")
  .Application__orderItemHead
    .Application__orderItemThumbnail(style="background-image:url({ opts.endpoint.thumbnail })")
    .Application__orderItemName { opts.endpoint.name || '-'}
  .Application__orderItemBody
    .Application__orderItemUrl
      .Application__orderItemUrlIcon
        dmc-icon(type="link")
      .Application__orderItemUrlLabel { opts.endpoint.url }

  script.
    import '../components/atoms/dmc-icon/index.tag';
    import script from './order-item';
    this.external(script);
