import forEach from 'mout/array/forEach';

export default function() {
  this.getItemList = () => {
    const columns = this.opts.columns;
    const list = [];
    forEach(this.opts.rows, row => {
      const items = [];
      forEach(columns, column => {
        items.push({
          key: column.key,
          title: column.title,
          type: column.type,
          cell: row[column.key]
        });
      });
      list.push(items);
    });
    return list;
  };
}
