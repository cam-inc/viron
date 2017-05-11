dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }")
  virtual(if="{ !!opts.pagination }")
    div paging info
    div currentPage is { opts.pagination.currentPage }
    div size is { opts.pagination.size }
    div maxPage is { opts.pagination.maxPage }
    dmc-button(label="prev" onClick="{ handlePrevButtonClick }")
    dmc-button(label="next" onClick="{ handleNextButtonClick }")

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

    handlePrevButtonClick(e) {
      this.opts.updater({
        limit: this.opts.pagination.size,
        offset: (this.opts.pagination.currentPage - 2) * this.opts.pagination.size
      });
    }

    handleNextButtonClick(e) {
      this.opts.updater({
        limit: this.opts.pagination.size,
        offset: this.opts.pagination.currentPage * this.opts.pagination.size
      });
    }
