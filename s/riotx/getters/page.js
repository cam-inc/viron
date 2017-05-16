// TODO `#/definitions/page`内のpropertiesやrequired定義は全サービス共通という認識でOK？
// swagger.jsonの$ref`#/definitions/page`に該当する。
// state内のデータはparse済みのもの。
export default {
  _: context => {
    return context.state.page;
  },

  name: context => {
    if (!context.state.page) {
      return '';
    }
    return context.state.page.name.get();
  },

  components: context => {
    if (!context.state.page) {
      return [];
    }
    return context.state.page.components;
  }
};
