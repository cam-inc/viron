import { filter, values } from "mout/object";

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
  dashboard: function (state, drawer = true) {
    return values(filter(state.dmc.pages, (v, k, arr) => {
      if (v.section !== "dashboard") {
        return false;
      }
      if (drawer && !v.drawer) {
        return false;
      }
      return true;

    }));
  }
}
