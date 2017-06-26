dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }")

  script.
    import '../../organisms/dmc-table/index.tag';
    import script from './table';
    this.external(script);
