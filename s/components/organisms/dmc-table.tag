dmc-table.Table
  .Table__head
    .Table__headRow
      .Table__headCell(each="{ getColumns() }") { title }
  .Table__body
    .Table__row(each="{ row in getRows() }")
      dmc-table-cell(each="{ cell in row }" cell="{ cell }")

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

dmc-table-cell.Table__cell
  virtual(if="{ opts.cell.isText }") { cell.value }
  virtual(if="{ opts.cell.isAction }")
    dmc-table-cell-action(each="{ action in opts.cell.actions }" action="{ action }")

dmc-table-cell-action
  dmc-button(label="{ opts.action.value }" onClick="{ handleButtonClick }")

  script.
    import '../atoms/dmc-button.tag';

    handleButtonClick() {
      this.opts.action.onClick(this.opts.action.id, this.opts.action.rowData);
    }
