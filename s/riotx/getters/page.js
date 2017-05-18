// swagger.jsonの$ref`#/definitions/page`に該当する。
// state内のデータはparse済みのもの。
export default {
  _: context => {
    return context.state.page.getRawValue();
  },

  name: context => {
    if (!context.state.page) {
      return '';
    }
    const rawData = context.state.page.getRawValue();
    return rawData.name;
  },

  components: context => {
    if (!context.state.page) {
      return [];
    }
    const rawData = context.state.page.getRawValue();
    return rawData.components;
  }
};
