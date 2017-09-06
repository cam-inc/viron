dmc-table-items.Table__items(class="{ isOpened ? 'Table__items--opened' : '' }")
  .Table__itemsHeader
    .Table__itemsTitle(ref="touch" onTap="handleHeaderTitleTap") { title }
    virtual(each="{ action in opts.actions}")
      dmc-table-items-button(action="{ action }" isAction="{ true }" onPat="{ parent.handleItemsActionButtonPat }")
    dmc-table-items-button.Table__itemsOpenShutButton(icon="up" onPat="{ handleOpenShutButtonPat }")
  virtual(if="{ isOpened }")
    dmc-table-item(each="{ item in opts.items }" item="{ item }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './button.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
