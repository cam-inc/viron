import { find, keys } from 'mout/object';

const number = '1234567890';
const alphabet = 'abcdefghiz';

const number2alphabet = (str) => {
  str += '';
  for (let i = 0; i < number.length; i++) {
    const re = new RegExp(number[i], 'g');
    str = str.replace(re, alphabet[i]);
  }
  return str;
};

export default {
  _: context => {
    return context.state.endpoints;
  },

  one: (context, key) => {
    const endpoints = context.state.endpoints;
    return endpoints[key];
  },

  oneByURL: (context, url) => {
    const endpoints = context.state.endpoints;
    return find(endpoints, endpoint => {
      return endpoint.url === url;
    });
  },

  nextKey: (context) => {
    return number2alphabet(keys(context.state.endpoints).length + 1);
  }

};
