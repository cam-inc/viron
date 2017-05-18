import { filter, values } from 'mout/object';
import constants from '../../core/constants';

export default {
  _: context => {
    if (!context.state.dmc) {
      return null;
    }
    return context.state.dmc.getRawValue();
  },

  pages: context => {
    const rawData = context.state.dmc.getRawValue();
    return rawData.pages;
  },

  name: context => {
    const rawData = context.state.dmc.getRawValue();
    return rawData.name;
  },

  // Display dashboard data for menu
  dashboard: (context) => {
    if (!context.state.dmc) {
      return [];
    }
    const rawData = context.state.dmc.getRawValue();
    const pages = rawData.pages;
    return values(filter(pages, v => {
      if (v.section !== constants.SECTION_DASHBOARD) {
        return false;
      }
      return true;
    }));
  },

  // Display dashboard data for menu
  manage: (context) => {
    if (!context.state.dmc) {
      return [];
    }
    const rawData = context.state.dmc.getRawValue();
    const pages = rawData.pages;
    return values(filter(pages, v => {
      if (v.section !== constants.SECTION_MANAGE) {
        return false;
      }
      return true;
    }));
  }
};
