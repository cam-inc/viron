import { reject } from 'mout/array';
import constants from '../../core/constants';

const generateID = () => {
  return `drawer_${Date.now()}`;
};

export default {
  add: (context, tagName, tagOpts = {}, drawerOpts = {}) => {
    context.state.drawers.push({
      id : generateID(),
      tagName,
      tagOpts,
      drawerOpts
    });
    return [constants.CHANGE_DRAWER];
  },

  remove: (context, drawerID) => {
    context.state.drawers = reject(context.state.drawers, drawer => {
      if (drawer.id === drawerID) {
        return true;
      }
      return false;
    });
    return [constants.CHANGE_DRAWER];
  }
};
