import 'whatwg-fetch';

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
    return fetch(url)
      .then((response) => {
        // ping ok!
        //return response;
        return;
      })
      .then(() => {
        // TODO 上書きの場合は、そもそも登録ボタンを押せなくする
        let endpoint = context.state.endpoint;
        const key = context.getter(constants.GETTER_ENDPOINT_NEXT_KEY);
        endpoint[key] = {
          url: url,
          memo: '',
          token: null,
          title: '',
          description: '',
          version: '',
          color: '',
          thumbnail: '',
          tags: [],
        };
        endpoint[key].memo = memo;
        return {
          key: key,
          endpoint: endpoint[key]
        };

      })
      .then((res) => {
        context.commit(constants.MUTATION_ENDPOINT_ADD, res);
        return res;
      })
    ;
  }
};
