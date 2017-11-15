export default {
  /**
   * ページ情報を書き換えます。
   * @param {riotx.Context} context
   * @param {Object|null} page
   * @return {Array}
   */
  all: (context, page) => {
    context.state.page = page;
    return ['page'];
  }
};
