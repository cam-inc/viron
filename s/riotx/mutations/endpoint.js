import storage from 'store';
import constants from '../../core/constants';

export default {
  show: function (context) {
    context.state.endpoint = storage.get(constants.STORAGE_ENDPOINT, {});
    return [constants.CHANGE_ENDPOINT];
  },
  removeAll: function (context) {
    context.state.endpoint = storage.remove(constants.STORAGE_ENDPOINT);
    return [constants.CHANGE_ENDPOINT];
  },

  remove: function (context, key) {
    delete context.state.endpoint[key]
    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT];
  },

  add: function (context, url, endpoint) {
    context.state.endpoint[url] = endpoint;
    // TODO 開発用に言ったにれておく
    context.state.endpoint['http://localhost:3000/swagger.json'] = {
      title: 'Service A', // @see /swagger.json/info/title
      description: 'Service A - Manage Console', // @see swagger.json/info/description
      version: '0.0.1', // @see /swagger.json/info/version
      color: 'red',// @see /dmc#color
      thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
      tags: ['dmc', 'example', 'develop', 'A'], // @see /dmc#tags
    };

    context.state.endpoint = storage.set(constants.STORAGE_ENDPOINT, context.state.endpoint);
    return [constants.CHANGE_ENDPOINT]; // TODO: モーダルチェンジイベントを入れるか相談
  }
};
