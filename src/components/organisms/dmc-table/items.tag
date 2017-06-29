dmc-table-items.Table__items(class="{ isOpened ? 'Table__items--opened' : '' }")
  .Table__itemsHeader
    .Table__itemsTitle(ref="touch" onTap="handleHeaderTitleTap") { title }
    .Table__itemsButton(if="{ isEditable }" ref="touch" onTap="handleEditButtonTap")
      dmc-icon(type="edit")
    .Table__itemsButton(ref="touch" onTap="handleFilterButtonTap")
      dmc-icon(type="filter")
    .Table__itemsButton.Table__itemsOpenShutButton(ref="touch" onTap="handleOpenShutButtonTap")
      dmc-icon(type="up")
  virtual(if="{ isOpened }")
    dmc-table-item(each="{ item in filteredItems }" item="{ item }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './item.tag';
    import script from './items';
    this.external(script);
