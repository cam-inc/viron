import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import forOwn from 'mout/object/forOwn';
import { constants as actions } from '../../../store/actions';
import '../../organisms/dmc-operation/index.tag';
import './operation.tag';

export default function() {
  const store = this.riotx.get();

  this.getColumns = () => {
    const columns = [];
    forOwn(this.opts.schemaobject.items.properties, (obj, key) => {
      columns.push({
        title: obj.description || key,
        type: obj.type,
        key
      });
    });
    return columns;
  };

  this.getRows = () => {
    const rows = [];
    forEach(this.opts.response, cells => {
      const row = {};
      forOwn(cells, (cell, key) => {
        row[key] = cell;
      });
      rows.push(row);
    });
    return rows;
  };

  this.getActions = () => {
    const actions = [];
    forEach(this.opts.rowactions, operationObject => {
      actions.push({
        operationId: operationObject.operationId,
        value: operationObject.summary || operationObject.operationId,
        description: operationObject.description,
        onPat: this.handleActionButtonPat
      });
    });
    return actions;
  };

  const createInitialQueries = (operationObject, rowData) => {
    const queries = {};
    const parameterObjects = operationObject.parameters;
    forEach(parameterObjects, parameterObject => {
      const name = parameterObject.name;
      if (parameterObject.in === 'body') {
        queries[name] = {};
        forOwn(parameterObject.schema.properties, (v, k) => {
          if (rowData[k]) {
            queries[name][k] = rowData[k];
          }
        });
      } else {
        if (!rowData[name]) {
          return;
        }
        queries[name] = rowData[name];
      }
    });

    return queries;
  };

  this.handleActionButtonPat = (operationId, rowIdx) => {
    const operationObject = find(this.opts.rowactions, operationObject => {
      return (operationObject.operationId === operationId);
    });
    const rowData = this.opts.response[rowIdx];
    const initialParameters = createInitialQueries(operationObject, rowData);
    store.action(actions.DRAWERS_ADD, 'dmc-component-operation', {
      title: operationObject.summary || operationObject.operationId,
      description: operationObject.description,
      operationObject,
      parameterObjects: operationObject.parameters,
      initialParameters,
      onComplete: () => {
        this.opts.updater();
      }
    });
  };
}
