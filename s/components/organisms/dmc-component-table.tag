dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }")

  script.
    import { find, forEach } from 'mout/array';
    import { forOwn } from 'mout/object';
    import constants from '../../core/constants';
    import '../organisms/dmc-operation.tag';
    import '../organisms/dmc-table.tag';
    import '../atoms/dmc-button.tag';

    getColumns() {
      const columns = [];
      if (!!this.opts.actions && this.opts.actions.length) {
        columns.push({
          title: 'action',
          key: constants.DMC_TABLE_ACTION_KEY
        });
      }
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
        if (!!this.opts.actions && this.opts.actions.length) {
          row[constants.DMC_TABLE_ACTION_KEY] = {
            isAction: true,
            actions: []
          };
          forEach(this.opts.actions, action => {
            row[constants.DMC_TABLE_ACTION_KEY].actions.push({
              id: action.operationId,
              value: action.operationId,
              rowData: cells,
              onClick: this.handleActionButtonClick
            });
          });
        }
        forOwn(cells, cell => {
          row[cell.key] = {
            isText: true,
            value: cell.get()
          };
        });
        rows.push(row);
      });
      return rows;
    }

    createInitialQueries(operation, rowData) {
      const queries = {};
      const parameters = operation.parameters;
      forEach(parameters, parameter => {
        const name = parameter.name;
        if (parameter.in === 'body') {
          queries[name] = {};
          forOwn(parameter.schema.properties, (v, k) => {
            if (rowData[k]) {
              queries[name][k] = rowData[k].get();
            }
          });
        } else {
          if (!rowData[name]) {
            return;
          }
          queries[name] = rowData[name].get()
        }
      });

      return queries;
    }

    handleActionButtonClick(operationID, rowData) {
      const operation = find(this.opts.actions, action => {
        return (action.operationId === operationID);
      });
      const initialQueries = this.createInitialQueries(operation, rowData);
      store.action(constants.ACTION_MODAL_SHOW, 'dmc-operation', {
        operation,
        initialQueries,
        onSuccess: () => {
          this.opts.updater();
        }
      });
    }
