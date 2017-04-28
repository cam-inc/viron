import constants from '../../core/constants';

export default {
  show: context => {
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
    // TODO URLにping チェックだけする処理を入れる
    // TODO https://github.com/github/fetch
    return new Promise((resolve, reject) => {
      let endpoint = context.state.endpoint;
      // TODO 上書きチェック　上書きしたときどうするかは相談
      if (!endpoint[url]) {
        endpoint[url] = {
          memo: '',
          token: null,
          title: '',
          description: '',
          version: '',
          color: '',
          thumbnail: '',
          tags: [],
        };
      }
      endpoint[url].memo = memo;
      resolve({
        url: url,
        endpoint: endpoint[url]
      })

    }).then(res => {
      context.commit(constants.MUTATION_ENDPOINT_ADD, res);
    });
  }
};
