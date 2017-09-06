dmc-table-item.Table__item(class="{ isOpened ? 'Table__item--opened' : '' }")
  .Table__itemHeader
    .Table__itemTitle { opts.item.title }
    .Table__itemType { opts.item.type }
  dmc-table-cell(data="{ opts.item }")

  script.
    import './cell.tag';
    import script from './item';
    this.external(script);
