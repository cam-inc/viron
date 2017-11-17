import exporter from './exporter';

export default exporter('components', {
  /**
   * 一件更新します。
   * @param {Object} state
   * @param {Object} params
   * @return {Array}
   */
  updateOne: (state, params) => {
    const component_uid = params.component_uid;
    // 存在しなければ新規作成。
    state.components[component_uid] = params;
    return ['components', component_uid];
  },

  /**
   * 一件削除します。
   * @param {Object} state
   * @param {String} component_uid
   * @return {Array}
   */
  removeOne: (state, component_uid) => {
    delete state.components[component_uid];
    return ['components', component_uid];
  },

  /**
   * 全件削除します。
   * @param {Object} state
   * @return {Array}
   */
  removeAll: state => {
    state.components = {};
    return ['components'];
  }
});
