import filter from 'mout/array/filter';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import indexOf from 'mout/array/indexOf';
import map from 'mout/array/map';
import sort from 'mout/array/sort';
import sortBy from 'mout/array/sortBy';
import unique from 'mout/array/unique';
import isArray from 'mout/lang/isArray';
import forOwn from 'mout/object/forOwn';
import keys from 'mout/object/keys';
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
    const columns = component.columns;
    // `table_labels` = 優先度が高いカラムkey群。
    const tableLabels = component.def.table_labels || [];
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
    default:
      operations = component.operations || [];
      break;
    }
    const path = component.def.api.path;
    const operationObject = find(operations, operation => {
      return (operation.path === path && operation.method === 'post');
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
   * 指定componentIDに対する要素のschemaObjectを返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object}
   */
  _schemaObject: (state, componentId) => {
    return state.components[componentId].schemaObject;
  },

  /**
   * 指定componentIDに対する要素のparamterObject群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _parameterObjects: (state, componentId) => {
    return state.components[componentId].parameterObjects;
  },

  /**
   * 全てののparamterObject群を返します。
   * @param {Object} state
   * @return {Array}
   */
  _parameterObjectsEntirely: state => {
    let entireParameterObjects = [];
    const weights = {};
    forOwn(state.components, component => {
      entireParameterObjects = entireParameterObjects.concat(component.parameterObjects || []);
    });
    entireParameterObjects = map(entireParameterObjects, entireParameterObject => {
      const name = entireParameterObject.name;
      weights[name] || (weights[name] = 0);
      weights[name] = weights[name] + 1;
      return ObjectAssign({}, entireParameterObject);
    });
    entireParameterObjects = unique(entireParameterObjects, (a, b) => {
      return (a.name === b.name);
    });
    forEach(entireParameterObjects, entireParameterObject => {
      entireParameterObject.weight = weights[entireParameterObject.name];
    });
    entireParameterObjects = sortBy(entireParameterObjects, entireParameterObject => {
      return weights[entireParameterObject.name] * (-1);
    });
    return entireParameterObjects;
  },

  /**
   * action(operationObject)群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _actions: (state, riotId) => {
    return map(state.components[riotId].actions, action => {
      return action.operationObject;
    });
  },

  /**
   * 自身に関連するaction(operationObject)群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _selfActions: (state, riotId) => {
    const actions = state.components[riotId].actions;
    const selfActions = filter(actions, action => {
      return (!action.appendTo || action.appendTo === 'self');
    });
    return map(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * テーブル行に関連するaction(operationObject)群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _rowActions: (state, riotId) => {
    const actions = state.components[riotId].actions;
    const selfActions = filter(actions, action => {
      return (action.appendTo === 'row');
    });
    return map(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * 指定riotIDに対する要素のページング機能ON/OFFを返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Boolean}
   */
  _hasPagination: (state, riotId) => {
    return state.components[riotId].hasPagination;
  },

  /**
   * 指定riotIDに対する要素の自動更新secを取得します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Number}
   */
  _autoRefreshSec: (state, riotId) => {
    return state.components[riotId].autoRefreshSec;
  },

  /**
   * 指定riotIDに対する要素のページング情報を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object}
   */
  _pagination: (state, riotId) => {
    return state.components[riotId].pagination;
  },

  /**
   * テーブル行のラベルに使用するkey群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _tableLabels: (state, riotId) => {
    return state.components[riotId].table_labels || [];
  },

  /**
   * テーブル列のキー群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  _tableColumns: (state, riotId) => {
    const response = state.components[riotId].response;
    if (!isArray(response) || !response.length) {
      return [];
    }
    return keys(response[0]);
  },

  /**
   * テーブル行に使用するprimaryキーを返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {String|null}
   */
  _primaryKey: (state, riotId) => {
    return state.components[riotId].primaryKey || null;
  }
});
