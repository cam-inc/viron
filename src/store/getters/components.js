import contains from 'mout/array/contains';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import indexOf from 'mout/array/indexOf';
import map from 'mout/array/map';
import sort from 'mout/array/sort';
import sortBy from 'mout/array/sortBy';
import unique from 'mout/array/unique';
import isNumber from 'mout/lang/isNumber';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import exporter from './exporter';

export default exporter('components', {
  /**
   * 全情報を返します。
   * @param {Object} state
   * @return {Object}
   */
  all: state => {
    return state.state.components;
  },

  /**
   * 指定componentIDに対する要素を返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {Object}
   */
  one: (state, componentId) => {
    return state.components[componentId];
  },

  /**
   * 指定componentIDに対する要素のcomponent定義を返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {Object}
   */
  def: (state, componentId) => {
    return state.components[componentId].def;
  },

  /**
   * 指定componentIDに対する要素のAPIレスポンスを返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {*}
   */
  response: (state, componentId) => {
    return state.components[componentId].response;
  },

  /**
   * 指定componentIDに対する要素のテーブルcolumn情報を返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {Array}
   */
  columns: (state, componentId) => {
    const component = state.components[componentId];
    // `table_labels` = 優先度が高いカラムkey群。
    const tableLabels = component.def.table_labels || [];
    // `sort` = ソート可能なkey群。
    const sortableKeys = component.def.sort || [];
    const columns = [];
    forEach(component.columns, column => {
      columns.push(ObjectAssign({}, column, {
        isSortable: contains(sortableKeys, column.key)
      }));
    });
    return sort(columns, (a, b) => {
      let idxA = indexOf(tableLabels, a.key);
      let idxB = indexOf(tableLabels, b.key);
      if (idxA >= 0) {
        idxA = tableLabels.length - idxA;
      }
      if (idxB >= 0) {
        idxB = tableLabels.length - idxB;
      }
      return (idxB - idxA);
    });
  },

  /**
   * 指定componentIDに対する要素のOperationObject群を返します。
   * @param {Object} state
   * @param {String} componentId
   * @param {String} category
   * @return {Array}
   */
  operations: (state, componentId, category) => {
    const component = state.components[componentId];
    let operations;
    switch (category) {
    case 'table':
      operations = component.tableOperations;
      break;
    case 'row':
      operations = component.rowOperations;
      break;
    case 'explorer':
      operations = component.explorerOperations;
      break;
    case 'item':
      operations = component.itemOperations;
      break;
    default:
      operations = component.operations || [];
      break;
    }
    return operations;
  },

  /**
   * 指定componentIDに対する要素のpostメソッドOperationObjectを返します。
   * @param {Object} state
   * @param {String} componentId
   * @param {String} category
   * @return {Object|null}
   */
  postOperation: (state, componentId, category) => {
    const component = state.components[componentId];
    let operations;
    switch (category) {
    case 'table':
      operations = component.tableOperations;
      break;
    case 'row':
      operations = component.rowOperations;
      break;
    case 'explorer':
      operations = component.explorerOperations;
      break;
    case 'item':
      operations = component.itemOperations;
      break;
    default:
      operations = component.operations || [];
      break;
    }
    const operationObject = find(operations, operation => {
      return (operation.method === 'post');
    });
    if (!operationObject) {
      return null;
    }
    return operationObject;
  },

  /**
   * 指定componentIDに対する要素のputメソッドOperationObjectを返します。
   * @param {Object} state
   * @param {String} componentId
   * @param {String} category
   * @return {Object|null}
   */
  putOperation: (state, componentId, category) => {
    const component = state.components[componentId];
    let operations;
    switch (category) {
    case 'table':
      operations = component.tableOperations;
      break;
    case 'row':
      operations = component.rowOperations;
      break;
    case 'explorer':
      operations = component.explorerOperations;
      break;
    case 'item':
      operations = component.itemOperations;
      break;
    default:
      operations = component.operations || [];
      break;
    }
    const operationObject = find(operations, operation => {
      return (operation.method === 'put');
    });
    if (!operationObject) {
      return null;
    }
    return operationObject;
  },

  /**
   * 指定componentIDに対する要素のdeleteメソッドOperationObjectを返します。
   * @param {Object} state
   * @param {String} componentId
   * @param {String} category
   * @return {Object|null}
   */
  deleteOperation: (state, componentId, category) => {
    const component = state.components[componentId];
    let operations;
    switch (category) {
    case 'table':
      operations = component.tableOperations;
      break;
    case 'row':
      operations = component.rowOperations;
      break;
    case 'explorer':
      operations = component.explorerOperations;
      break;
    case 'item':
      operations = component.itemOperations;
      break;
    default:
      operations = component.operations || [];
      break;
    }
    const operationObject = find(operations, operation => {
      return (operation.method === 'delete');
    });
    if (!operationObject) {
      return null;
    }
    return operationObject;
  },

  /**
   * 指定componentIDに対する要素の検索用ParameterObject群を返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {Array}
   */
  searchParameters: (state, componentId) => {
    return state.components[componentId]['searchParameters'];
  },

  /**
   * 指定componentIDに対する要素のprimaryキーを返します。
   * @param {Object} state
   * @param {String} componentId
   * @return {String|undefined}
   */
  primary: (state, componentId) => {
    return state.components[componentId]['primary'];
  },

  /**
   * 指定riotIDに対する要素のページング情報を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object|null}
   */
  pagination: (state, riotId) => {
    return state.components[riotId].pagination || null;
  },

  /**
   * 指定riotIDに対する要素のページング機能がONか調べます。
   * @param {Object} state
   * @param {String} riotId
   * @return {Boolean}
   */
  hasPagination: (state, riotId) => {
    return (state.components[riotId].def.pagination && state.components[riotId].pagination.max >= 2);
  },

  /**
   * 指定riotIDに対する要素の自動更新secを取得します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Number|null}
   */
  autoRefreshSec: (state, riotId) => {
    const autoRefreshSec = state.components[riotId].autoRefreshSec;
    if (!isNumber(autoRefreshSec)) {
      return null;
    }
    return autoRefreshSec;
  },

  /**
   * 横断検索用のParameterObject群を返します。
   * @param {Object} state
   * @return {Array}
   */
  parameterObjectsForCrossSearch: state => {
    let parameterObjects = [];
    forOwn(state.components, component => {
      parameterObjects = parameterObjects.concat(component.searchParameters || []);
    });
    const weights = {};
    parameterObjects = map(parameterObjects, parameterObject => {
      const name = parameterObject.name;
      weights[name] || (weights[name] = 0);
      weights[name] = weights[name] + 1;
      return ObjectAssign({}, parameterObject);
    });
    parameterObjects = unique(parameterObjects, (a, b) => {
      return (a.name === b.name);
    });
    parameterObjects = sortBy(parameterObjects, parameterObject => {
      return weights[parameterObject.name] * (-1);
    });
    return parameterObjects;
  }

});
