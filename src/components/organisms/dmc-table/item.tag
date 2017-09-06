dmc-table-item.Table__item(ref="touch" onTap="handleTap")
  .Table__itemHeader
    .Table__itemTitle { opts.item.title }
    .Table__itemType { opts.item.type }
  dmc-table-cell(data="{ opts.item }")

  script.
    import './cell.tag';
    import script from './item';
    this.external(script);
