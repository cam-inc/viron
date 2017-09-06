dmc-table-items.Table__items(class="{ isOpened ? 'Table__items--opened' : '' }")
  .Table__itemsHeader
    .Table__itemsTitle(ref="touch" onTap="handleHeaderTitleTap") { title }
    virtual(each="{ action in opts.actions}")
      dmc-table-items-button(action="{ action }" isAction="{ true }" onPat="{ parent.handleItemsActionButtonPat }")
    dmc-table-items-button.Table__itemsOpenShutButton(icon="up" onPat="{ handleOpenShutButtonPat }")
  virtual(if="{ isOpened }")
    .Table__itemsContent
      .Table__itemsList
        dmc-table-item(each="{ item in getFilteredItems() }" item="{ item }")
      .Table__itemsControl
        .Table__itemsDetailButton(ref="touch" onTap="handleDetailButtonTap" onMouseOver="{ handleDetailButtonMouseOver }" onMouseOut="{ handleDetailButtonMouseOut }")
          dmc-icon(type="scan")
          dmc-tooltip(if="{ isTooltipVisible }" placement="topRight" label="全て表示")
          .Table__itemsDetailButtonCatcher

  script.
    import '../../atoms/dmc-icon/index.tag';
    import '../../atoms/dmc-tooltip/index.tag';
    import './button.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
