import 'whatwg-fetch';

import constants from '../../core/constants';

export default {
  get: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINT);
      });
  },
  remove: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINT_REMOVE, key);
      });
  },
  removeAll: (context) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINT_REMOVE_ALL);
      });
  },
  add: (context, url, memo) => {
    return fetch(url)
      .then((response) => {
        // ping ok!
        //return response;
        return;
      })
      .then(() => {
        const key = context.getter(constants.GETTER_ENDPOINT_NEXT_KEY);
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          title: '',
          description: '',
          version: '',
          color: '',
          thumbnail: '',
          tags: []
        };
        return {
          key,
          endpoint: newEndpoint
        };
      })
      .then((res) => {
        context.commit(constants.MUTATION_ENDPOINT_ADD, res.key, res.endpoint);
      });
  }
};
