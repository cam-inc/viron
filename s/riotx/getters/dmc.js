import { filter, values } from 'mout/object';

export default {
  show: state => {
    return state.dmc;
  },
  pages: state => {
    return state.dmc.pages;
  },
  name: state => {
    return state.dmc.name;
  },
  // Display dashboard data for drawer
  dashboard: (state) => {
    return values(filter(state.dmc.pages, v => {
      if (v.section !== "dashboard") {
        return false;
      }
      if (!v.drawer) {
        return false;
      }
      return true;
    }));
  }
};
