export default {
  show: function (state, obj) {
    state.dmc = obj;
  },
  remove: function (state) {
    state.dmc = null;
  }

}
