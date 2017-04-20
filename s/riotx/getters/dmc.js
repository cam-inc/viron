import { filter, values } from 'mout/object';

export default {
  show: context => {
    return context.state.dmc;
  },
  pages: context => {
    return context.state.dmc.pages;
  },
  name: context => {
    return context.state.dmc.name;
  },
  // Display dashboard data for drawer
  dashboard: (context) => {
    return values(filter(context.state.dmc.pages, v => {

      if (v.section !== "dashboard") {
        return false;
      }
      return v.drawer;

    }));
  }
};
