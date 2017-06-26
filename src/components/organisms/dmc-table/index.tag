dmc-table.Table
  .Table__head
    .Table__headRow
      .Table__headCell(each="{ getColumns() }") { title }
  .Table__body
    .Table__row(each="{ row in getRows() }")
      dmc-table-cell(each="{ cell in row }" cell="{ cell }")

  script.
    import './cell.tag';
    import script from './index';
    this.external(script);
