dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }")

  script.
    import { forEach } from 'mout/array';
    import { forOwn } from 'mout/object';
    import '../organisms/dmc-table.tag';
    import '../atoms/dmc-button.tag';

    getColumns() {
      const columns = [];
      forOwn(this.opts.data[0], (v, k) => {
        columns.push({
          title: k,
          key: k
        });
      });
      return columns;
    }

    getRows() {
      const rows = [];
      forEach(this.opts.data, cells => {
        const row = {};
        forOwn(cells, cell => {
          row[cell.key] = cell.get();
        });
        rows.push(row);
      });
      return rows;
    }
