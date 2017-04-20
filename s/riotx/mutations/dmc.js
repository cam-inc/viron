export default {
  show: function (context, state, obj) {
    state.dmc = obj;
  },
  remove: function (context, state) {
    state.dmc = null;
  }
};
