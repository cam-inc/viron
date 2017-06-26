import forEach from 'mout/array/forEach';

export default function() {
  this.getColumns = () => {
    // TODO: 必要に応じて機能と追加すること。
    // TODO: columnsを編集すればrowsも自動的に変更される想定
    return this.opts.columns;
  };

  this.getRows = () => {
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
  };
}
