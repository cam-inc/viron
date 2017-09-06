dmc-table.Table
  dmc-table-items(each="{ items, idx in getItemList() }" items="{ items }" actions="{ parent.opts.actions }" idx="{ idx }" tableLabels="{ parent.opts.tablelabels }" selectedTableColumns="{ parent.opts.selectedtablecolumns }")

  script.
    import './items.tag';
    import script from './index';
    this.external(script);
