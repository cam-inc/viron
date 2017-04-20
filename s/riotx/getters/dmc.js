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
    const pages = (context.state.dmc && context.state.dmc.pages) || [];
    return values(filter(pages, v => {

      if (v.section !== "dashboard") {
        return false;
      }
      return v.drawer;

    }));
  }
};
