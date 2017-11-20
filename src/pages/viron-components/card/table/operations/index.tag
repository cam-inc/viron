viron-components-page-table-operations.ComponentsPage_Card_Table_Operations
  viron-components-page-table-operations-item(each="{ operation in opts.operations }" operation="{ operation }" closer="{ closer }")

  script.
    import './item/index.tag';
    import script from './index';
    this.external(script);
