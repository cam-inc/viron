import every from "mout/object";

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
  // Display dashboard data for drawer
  dashboard: function (drawer = true) {
    console.log(every)
    debugger;
    state.dmc.pages
  }
}
