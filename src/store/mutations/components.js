import { constants as states } from '../states';

export default {
  /**
   * 一件更新します。
   * @param {riotx.Context} context
   * @param {Object} params
   * @return {Array}
   */
  updateOne: (context, params) => {
    const {
      component_uid,
      response,
      schemaObject,
      parameterObjects,
      actions,
      pagination,
      table_labels
    } = params;

    // 存在しなければ新規作成。
    const component = context.state.components[component_uid] || {};
    // APIレスポンス内容そのまま。
    component.response = response;
    // OASのschema。
    component.schemaObject = schemaObject;
    // OASのparameterObject群。
    component.parameterObjects = parameterObjects;
    // 関連API群。
    component.actions = actions;
    // ページング関連。
    component.pagination = pagination;
    // テーブル行名で優先度が高いkey群。
    component.table_labels = table_labels;

    context.state.components[component_uid] = component;
    return [states.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Array}
   */
  removeOne: (context, component_uid) => {
    delete context.state.components[component_uid];
    return [states.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.components = {};
    return [states.COMPONENTS];
  }
};
