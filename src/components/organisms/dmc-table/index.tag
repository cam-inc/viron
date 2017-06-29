dmc-table.Table
  dmc-table-items(each="{ items in getItemList() }" items="{ items }" actions="{ actions }")

  script.
    import './items.tag';
    import script from './index';
    this.external(script);
