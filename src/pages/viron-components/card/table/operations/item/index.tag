viron-components-page-table-operations-item.ComponentsPage_Card_Table_Operations_Item(onTap="{ handleTap }")
  span { opts.operation.summary || opts.operation.operationId }

  script.
    import script from './index';
    this.external(script);
