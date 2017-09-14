viron-component-table.ComponentTable
  viron-table(columns="{ getColumns() }" rows="{ getRows() }" actions="{ getActions()}" tableLabels="{ opts.tablelabels }" selectedTableColumns="{ opts.selectedtablecolumns }")

  script.
    import '../../organisms/viron-table/index.tag';
    import script from './table';
    this.external(script);
