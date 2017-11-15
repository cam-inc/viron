import filter from 'mout/array/filter';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
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
   * 指定riotIDに対する要素を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object}
   */
  one: (state, riotId) => {
    return state.components[riotId];
  },

  /**
   * 指定riotIDに対する要素のAPIレスポンスを返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {*}
   */
  response: (state, riotId) => {
    return state.components[riotId].response;
  },

  /**
   * 指定riotIDに対する要素のschemaObjectを返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object}
   */
  schemaObject: (state, riotId) => {
    return state.components[riotId].schemaObject;
  },

  /**
   * 指定riotIDに対する要素のparamterObject群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  parameterObjects: (state, riotId) => {
    return state.components[riotId].parameterObjects;
  },

  /**
   * 全てののparamterObject群を返します。
   * @param {Object} state
   * @return {Array}
   */
  parameterObjectsEntirely: state => {
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
  actions: (state, riotId) => {
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
  selfActions: (state, riotId) => {
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
  rowActions: (state, riotId) => {
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
  hasPagination: (state, riotId) => {
    return state.components[riotId].hasPagination;
  },

  /**
   * 指定riotIDに対する要素の自動更新secを取得します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Number}
   */
  autoRefreshSec: (state, riotId) => {
    return state.components[riotId].autoRefreshSec;
  },

  /**
   * 指定riotIDに対する要素のページング情報を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Object}
   */
  pagination: (state, riotId) => {
    return state.components[riotId].pagination;
  },

  /**
   * テーブル行のラベルに使用するkey群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  tableLabels: (state, riotId) => {
    return state.components[riotId].table_labels || [];
  },

  /**
   * テーブル列のキー群を返します。
   * @param {Object} state
   * @param {String} riotId
   * @return {Array}
   */
  tableColumns: (state, riotId) => {
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
  primaryKey: (state, riotId) => {
    return state.components[riotId].primaryKey || null;
  }
});
