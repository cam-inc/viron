import { keys } from 'mout/object';

export default {
  list: context => {
    return context.state.endpoint;
  },
  nextKey: (context) => {
    return keys(context.state.endpoint).length;
  },
  one: (context, key) => {
    return context.state.endpoint[key];
  }
};
