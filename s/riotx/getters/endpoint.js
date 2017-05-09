import { keys } from 'mout/object';

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
  list: context => {
    return context.state.endpoint;
  },
  nextKey: (context) => {
    return number2alphabet(keys(context.state.endpoint).length + 1);
  },
  one: (context, key) => {
    const endpoints = context.state.endpoint;
    if (!endpoints || !endpoints[key]) {
      return {};
    }
    return endpoints[key];
  }
};
