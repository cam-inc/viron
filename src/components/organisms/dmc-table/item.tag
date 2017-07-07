dmc-table-item.Table__item(class="{ isOpened ? 'Table__item--opened' : '' }")
  .Table__itemHeader(ref="touch" onTap="handleHeaderTap")
    .Table__itemInfo
      .Table__itemTitle { opts.item.title }
      .Table__itemType { opts.item.type }
    .Table__itemOpenShut
      dmc-icon(type="up")
  virtual(if="{ isOpened }")
    dmc-table-cell(cell="{ opts.item.cell }")

  script.
    import '../../atoms/dmc-icon/index.tag';
    import './cell.tag';
    import script from './item';
    this.external(script);
