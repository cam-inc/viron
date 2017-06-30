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
   * 自身に関連するactionを返します。
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
   * テーブル行に関連するactionを返します。
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
  }
};
