import { constants as states } from '../states';

export default {
  /**
   * 一件更新します。
   * @param {riotx.Context} context
   * @param {Object} params
   * @return {Array}
   */
  updateOne: (context, params) => {
    const component_uid = params.component_uid;
    // 存在しなければ新規作成。
    context.state.components[component_uid] = params;
    return [states.COMPONENTS, states.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Array}
   */
  removeOne: (context, component_uid) => {
    delete context.state.components[component_uid];
    return [states.COMPONENTS, states.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.components = {};
    return [states.COMPONENTS, states.COMPONENTS];
  }
};
