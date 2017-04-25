import { filter, values } from 'mout/object';
import constants from '../../core/constants';

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

      if (v.section !== constants.SECTION_DASHBOARD) {
        return false;
      }
      return true;

    }));
  },
  // Display dashboard data for drawer
  manage: (context) => {
    const pages = (context.state.dmc && context.state.dmc.pages) || [];
    return values(filter(pages, v => {

      if (v.section !== constants.SECTION_MANAGE) {
        return false;
      }
      return true;

    }));
  }
};
