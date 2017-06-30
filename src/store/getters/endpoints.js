import find from 'mout/object/find';
import keys from 'mout/object/keys';

const number = '1234567890';
const alphabet = 'abcdefghij';

const number2alphabet = str => {
  str += '';
  for (let i = 0; i < number.length; i++) {
    const re = new RegExp(number[i], 'g');
    str = str.replace(re, alphabet[i]);
  }
  return str;
};

export default {
  /**
   * 全endpointを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.endpoints;
  },

  /**
   * 指定keyにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} key
   * @return {Object}
   */
  one: (context, key) => {
    return context.state.endpoints[key];
  },

  /**
   * 指定urlにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} url
   * @return {Object}
   */
  oneByURL: (context, url) => {
    const endpoints = context.state.endpoints;
    return find(endpoints, endpoint => {
      return endpoint.url === url;
    });
  },

  /**
   * 次のkeyを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  nextKey: context => {
    return number2alphabet(keys(context.state.endpoints).length + 1);
  }

};
