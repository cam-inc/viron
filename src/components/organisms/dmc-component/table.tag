dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }" actions="{ getActions()}" tableLabels="{ opts.tablelabels }" selectedTableColumns="{ opts.selectedtablecolumns }")

  script.
    import '../../organisms/dmc-table/index.tag';
    import script from './table';
    this.external(script);
