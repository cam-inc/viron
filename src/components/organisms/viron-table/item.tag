viron-table-item.Table__item(class="{ opts.isdetailmode ? 'Table__item--detail' : '' }" onClick="{ handleClick }")
  .Table__itemHeader
    .Table__itemTitle { opts.item.title }
    .Table__itemType { opts.item.type }
  viron-table-cell(data="{ opts.item }" isDetailMode="{ opts.isdetailmode }")

  script.
    import './cell.tag';
    import script from './item';
    this.external(script);
