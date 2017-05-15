import constants from '../../core/constants';

export default {
  get: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINTS);
      });
  },

  remove: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINTS_REMOVE, key);
      });
  },

  removeAll: (context) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants.MUTATION_ENDPOINTS_REMOVE_ALL);
      });
  },

  add: (context, url, memo) => {
    return fetch(url)
      .then(() => {
        // ping ok!
        // 401 is expected because we didn't have a authorization token yet.
        //return response;
        return;
      })
      .then(() => {
        const key = context.getter(constants.GETTER_ENDPOINTS_NEXT_KEY);
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          name: '',
          description: '',
          version: '',
          color: '',
          thumbnail: 'https://dummyimage.com/600x400/000/fff',
          tags: []
        };
        return {
          key,
          endpoint: newEndpoint
        };
      })
      .then((res) => {
        context.commit(constants.MUTATION_ENDPOINTS_ADD, res.key, res.endpoint);
      });
  }
};
