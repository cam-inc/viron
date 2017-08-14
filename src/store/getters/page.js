export default {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.page || {};
  },

  /**
   * ページIDを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  id: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.id;
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.name;
  },

  /**
   * コンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  components: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return page.components;
  }
};
