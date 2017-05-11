dmc-component-table.ComponentTable
  virtual(if="{ !!opts.search }")
    dmc-button(label="search" onClick="{ handleSearchButtonClick }")
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

    handleSearchButtonClick() {
      // TODO: 現状は適当な値。修正すること。
      const key = this.opts.search[0].key.get();
      const type = this.opts.search[0].type.get();
      this.opts.updater({
        [key]: 'testname'
      });
    }

    handlePrevButtonClick() {
      this.opts.updater({
        limit: this.opts.pagination.size,
        offset: (this.opts.pagination.currentPage - 2) * this.opts.pagination.size
      });
    }

    handleNextButtonClick() {
      this.opts.updater({
        limit: this.opts.pagination.size,
        offset: this.opts.pagination.currentPage * this.opts.pagination.size
      });
    }
