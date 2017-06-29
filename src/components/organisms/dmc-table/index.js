import filter from 'mout/array/filter';
import forEach from 'mout/array/forEach';

export default function() {
  this.getColumns = () => {
    // TODO: 必要に応じて機能と追加すること。
    // TODO: columnsを編集すればrowsも自動的に変更される想定
    // TODO: 見直すこと
    return filter(this.opts.columns, column => {
      return (column.key !== 'dmc_table_action_key');
    });
  };

  this.getItemList = () => {
    const columns = this.getColumns();
    const list = [];
    forEach(this.opts.rows, row => {
      const items = [];
      forEach(columns, column => {
        items.push({
          key: column.key,
          title: column.title,
          value: row[column.key]
        });
      });
      list.push(items);
    });
    return list;
  };
}
