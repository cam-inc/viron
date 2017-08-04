import filter from 'mout/array/filter';
import map from 'mout/array/map';

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
   * action(pathItemObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  actions: (context, riotId) => {
    return map(context.state.components[riotId].actions, action => {
      return action.pathItemObject;
    });
  },

  /**
   * 自身に関連するaction(pathItemObject)群を返します。
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
      return action.pathItemObject;
    });
  },

  /**
   * テーブル行に関連するaction(pathItemObject)群を返します。
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
      return action.pathItemObject;
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
  }
};
