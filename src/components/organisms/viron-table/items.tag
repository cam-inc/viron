viron-table-items.Table__items(class="{ isOpened ? 'Table__items--opened' : '' }")
  .Table__itemsHeader
    .Table__itemsTitle(ref="touch" onTap="handleHeaderTitleTap") { title }
    virtual(each="{ action in opts.actions}")
      viron-table-items-button(action="{ action }" isAction="{ true }" onPpat="{ parent.handleItemsActionButtonPpat }")
    viron-table-items-button.Table__itemsOpenShutButton(icon="up" onPpat="{ handleOpenShutButtonPpat }")
  virtual(if="{ isOpened }")
    .Table__itemsContent
      .Table__itemsList
        viron-table-item(each="{ item in getFilteredItems() }" item="{ item }")
      .Table__itemsControl
        .Table__itemsDetailButton(ref="touch" onTap="handleDetailButtonTap" onMouseOver="{ handleDetailButtonMouseOver }" onMouseOut="{ handleDetailButtonMouseOut }")
          viron-icon(type="scan")
          viron-tooltip(if="{ isTooltipVisible }" placement="topRight" label="全て表示")
          .Table__itemsDetailButtonCatcher

  script.
    import '../../atoms/viron-icon/index.tag';
    import '../../atoms/viron-tooltip/index.tag';
    import './button.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
