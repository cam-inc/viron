dmc-table.Table
  .Table__head
    .Table__headRow
      .Table__headCell(each="{ getColumns() }") { title }
  .Table__body
    dmc-table-row(each="{ row in getRows() }" row="{ row }")

  script.
    import { forEach } from 'mout/array';

    getColumns() {
      // TODO: 必要に応じて機能と追加すること。
      // TODO: columnsを編集すればrowsも自動的に変更される想定
      return this.opts.columns;
    }

    getRows() {
      const columns = this.getColumns();
      const rows = [];
      forEach(this.opts.rows, row => {
        const arrayedRow = [];
        forEach(columns, column => {
          arrayedRow.push(row[column.key]);
        });
        rows.push(arrayedRow);
      });
      return rows;
    }

dmc-table-row.Table__row
  .Table__cell(each="{ cell in opts.row }") { cell }
