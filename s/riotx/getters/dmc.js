export default {
  show: function (state) {
    return state.dmc;
  },
  pages: function (state) {
    return state.dmc.pages
  },
  name: function (state) {
    return state.dmc.name
  },
}
