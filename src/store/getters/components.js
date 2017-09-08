import filter from 'mout/array/filter';
import map from 'mout/array/map';
import isArray from 'mout/lang/isArray';
import keys from 'mout/object/keys';

export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.components;
  },

  /**
   * 指定riotIDに対する要素を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  one: (context, riotId) => {
    return context.state.components[riotId];
  },

  /**
   * 指定riotIDに対する要素のAPIレスポンスを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {*}
   */
  response: (context, riotId) => {
    return context.state.components[riotId].response;
  },

  /**
   * 指定riotIDに対する要素のschemaObjectを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  schemaObject: (context, riotId) => {
    return context.state.components[riotId].schemaObject;
  },

  /**
   * 指定riotIDに対する要素のparamterObject群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  parameterObjects: (context, riotId) => {
    return context.state.components[riotId].parameterObjects;
  },

  /**
   * action(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  actions: (context, riotId) => {
    return map(context.state.components[riotId].actions, action => {
      return action.operationObject;
    });
  },

  /**
   * 自身に関連するaction(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  selfActions: (context, riotId) => {
    const actions = context.state.components[riotId].actions;
    const selfActions = filter(actions, action => {
      return (!action.appendTo || action.appendTo === 'self');
    });
    return map(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * テーブル行に関連するaction(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  rowActions: (context, riotId) => {
    const actions = context.state.components[riotId].actions;
    const selfActions = filter(actions, action => {
      return (action.appendTo === 'row');
    });
    return map(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * 指定riotIDに対する要素のページング機能ON/OFFを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Boolean}
   */
  hasPagination: (context, riotId) => {
    return context.state.components[riotId].hasPagination;
  },

  /**
   * 指定riotIDに対する要素のページング情報を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  pagination: (context, riotId) => {
    return context.state.components[riotId].pagination;
  },

  /**
   * テーブル行のラベルに使用するkey群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  tableLabels: (context, riotId) => {
    return context.state.components[riotId].table_labels || [];
  },

  /**
   * テーブル列のキー群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  tableColumns: (context, riotId) => {
    const response = context.state.components[riotId].response;
    if (!isArray(response) || !response.length) {
      return [];
    }
    return keys(response[0]);
  },

  /**
   * テーブル行に使用するprimaryキーを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {String|null}
   */
  primaryKey: (context, riotId) => {
    return context.state.components[riotId].primaryKey || null;
  }
};
