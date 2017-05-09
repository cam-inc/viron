import storage from 'store';
import constants from '../../core/constants';

export default {
  show: function (context) {
    context.state.endpoint = storage.get(constants.STORAGE_ENDPOINT, {});
    return [constants.CHANGE_ENDPOINT];
  },

  removeAll: function (context) {
    context.state.endpoint = {};
    storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  },

  remove: function (context, key) {
    delete context.state.endpoint[key];
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  },

  add: function (context, key, endpoint) {
    context.state.endpoint[key] = endpoint;

    //////////////////
    // TODO 開発用に一旦入れておくだけ
    context.state.endpoint['zzzzzzzzzz'] = {
      url: 'http://localhost:3000/swagger.json',
      name: 'Service A', // @see /swagger.json/info/title
      description: 'Service A - Manage Console', // @see swagger.json/info/description
      version: '0.0.1', // @see /swagger.json/info/version
      color: 'red',// @see /dmc#color
      thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
      tags: ['dmc', 'example', 'develop', 'A'], // @see /dmc#tags
      token: null
    };
    //////////////////

    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  },

  update: function (context, key, endpoint) {
    context.state.endpoint[key] = endpoint;
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  },

  updateToken: function (context, key, token) {
    context.state.endpoint[key].token = token;
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    // TODO エラー通知をlocalstorageに保存する処理を入れる
    if (!token) {
      return [constants.CHANGE_ENDPOINT_TOKEN_ERROR];
    }
    // TODO いらない
    context.state.current = storage.set(constants.STORAGE_CURRENT, key);
    return [constants.CHANGE_ENDPOINT];
  },
};
