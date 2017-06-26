export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    if (!context.state.page) {
      return {};
    }
    return context.state.page.getRawValue();
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    if (!context.state.page) {
      return '';
    }
    const rawData = context.state.page.getRawValue();
    return rawData.name;
  },

  /**
   * コンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  components: context => {
    if (!context.state.page) {
      return [];
    }
    const rawData = context.state.page.getRawValue();
    return rawData.components;
  }
};
