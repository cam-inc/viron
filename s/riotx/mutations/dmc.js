export default {
  show: function (context, obj) {
    context.state.dmc = obj;
  },
  remove: function (context) {
    context.state.dmc = null;
  }
};
