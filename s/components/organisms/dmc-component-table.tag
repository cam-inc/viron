dmc-component-table.ComponentTable
  dmc-table(columns="{ getColumns() }" rows="{ getRows() }")

  script.
    import { find, forEach } from 'mout/array';
    import { forOwn } from 'mout/object';
    import swagger from '../../swagger';
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
      forEach(this.opts._data.getValue(0).getKeys(), k => {
        columns.push({
          title: k,
          key: k
        });
      });
      return columns;
    }

    getRows() {
      const rows = [];
      forEach(this.opts._data.getValue(), cells => {
        const row = {};
        if (!!this.opts.actions && this.opts.actions.length) {
          row[constants.DMC_TABLE_ACTION_KEY] = {
            isAction: true,
            actions: []
          };
          forEach(this.opts.actions, action => {
            let value = action.summary;
            if (!value) {
              const obj = swagger.getMethodAndPathByOperationID(this.opts.action.operationId);
              value = `${obj.method} ${obj.path}`;
            }
            row[constants.DMC_TABLE_ACTION_KEY].actions.push({
              id: action.operationId,
              value,
              tooltip: action.description,
              rowData: cells,
              onClick: this.handleActionButtonClick
            });
          });
        }
        forOwn(cells.getValue(), cell => {
          row[cell.getKey()] = {
            isText: true,
            value: cell.getValue()
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
            if (rowData.getValue(k)) {
              queries[name][k] = rowData.getValue(k).getValue();
            }
          });
        } else {
          if (!rowData.getValue(name)) {
            return;
          }
          queries[name] = rowData.getValue(name).getValue();
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
