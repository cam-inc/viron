dmc-component-table.ComponentTable
  .ComponentTable__head
    .ComponentTable__name TODO
  .ComponentTable__body
    table.ComponentTable__table
      thead.ComponentTable__tableHead
        tr
          td(each="{ getColumns() }") { name }
      tbody.ComponentTable__tableBody
        tr(each="{ data in getDataset() }")
          td(each="{ d in data }") { d }
  .ComponentTable__tail
      div paging info
      div currentPage is { opts.pagination.currentPage }
      div size is { opts.pagination.size }
      div maxPage is { opts.pagination.maxPage }
      dmc-button(label="prev" onClick="{ handlePrevButtonClick }")
      dmc-button(label="next" onClick="{ handleNextButtonClick }")

  script.
    import { forEach } from 'mout/array';
    import { forOwn } from 'mout/object';
    import '../atoms/dmc-button.tag';

    getColumns() {
      const columns = [];
      forOwn(this.opts.data[0], (v, k) => {
        columns.push({
          name: k,
          targetKey: k
        });
      });
      return columns;
    }

    getDataset() {
      const dataset = [];
      forEach(this.opts.data, data => {
        const row = [];
        forEach(this.getColumns(), column => {
          row.push(data[column.name].get());
        });
        dataset.push(row);
      });
      return dataset;
    }

    handlePrevButtonClick(e) {
      this.opts.updater({
        offset: (this.opts.pagination.currentPage - 2) * this.opts.pagination.size
      });
    }

    handleNextButtonClick(e) {
      this.opts.updater({
        offset: this.opts.pagination.currentPage * this.opts.pagination.size
      });
    }
