import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import swagger from '../../../core/swagger';
import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-operation/index.tag';

export default function() {
  const store = this.riotx.get();

  this.getColumns = () => {
    const columns = [];
    forEach(this.opts.data.getValue(0).getKeys(), k => {
      columns.push({
        title: k,
        key: k
      });
    });
    return columns;
  };

  this.getRows = () => {
    const rows = [];
    forEach(this.opts.data.getValue(), cells => {
      const row = {};
      forOwn(cells.getValue(), cell => {
        row[cell.getKey()] = cell;
      });
      rows.push(row);
    });
    return rows;
  };

  this.getActions = () => {
    const actions = [];
    forEach(this.opts.actions, action => {
      let value = action.summary;
      if (!value) {
        const obj = swagger.getMethodAndPathByOperationID(this.opts.action.operationId);
        value = `${obj.method} ${obj.path}`;
      }
      actions.push({
        id: action.operationId,
        value,
        description: action.description,
        rowData: this.opts.data,
        onPat: this.handleActionButtonPat
      });
    });
    return actions;
  };

  this.createInitialQueries = (operation, rowData) => {
    const queries = {};
    const parameters = operation.parameters;
    forEach(parameters, parameter => {
      const name = parameter.name;
      if (parameter.in === 'body') {
        queries[name] = {};
        forOwn(parameter.schema.properties, (v, k) => {
          if (rowData.getValue(k)) {
            queries[name][k] = rowData.getValue(k).getRawValue();
          }
        });
      } else {
        if (!rowData.getValue(name)) {
          return;
        }
        queries[name] = rowData.getValue(name).getRawValue();
      }
    });

    return queries;
  };

  this.handleActionButtonPat = (operationID, rowData) => {
    const operation = find(this.opts.actions, action => {
      return (action.operationId === operationID);
    });
    const initialQueries = this.createInitialQueries(operation, rowData);
    store.action(actions.DRAWERS_ADD, 'dmc-operation', {
      operation,
      initialQueries,
      onSuccess: () => {
        this.opts.updater();
      }
    });
  };
}
