import constants from '../../core/constants';

export default {
  show: context => {
    return Promise
      .resolve()
      .then(() => new Promise(resolve => {

        // TODO: あとで store.js に変える
        const data = {
          'http://localhost:3000/swagger.json': {
            title: 'Service A', // @see /swagger.json/info/title
            description: 'Service A - Manage Console', // @see swagger.json/info/description
            version: '0.0.1', // @see /swagger.json/info/version
            theme: 'dark',// @see /dmc#theme
            thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
            tags: ['dmc', 'example', 'develop', 'A'], // @see /dmc#tags
          },
          'http://localhost:3001/swagger.json': {
            title: 'Service A',
            description: 'Service A - Manage Console',
            version: '43.1.1',
            theme: 'dark',
            thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
            tags: ['dmc', 'example', 'develop', 'A'],
          },
          'http://localhost:3002/swagger.json': {
            title: 'Service B',
            description: 'Service B - Manage Console',
            version: '1.3.1',
            theme: 'light',
            thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
            tags: ['dmc', 'example', 'staging', 'B'],
          },
          'http://localhost:3003/swagger.json': {
            title: 'Service C',
            description: 'Service C - Manage Console',
            version: '2.0.1',
            theme: 'dark',
            thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
            tags: ['dmc', 'example', 'production', 'C'],
          },
        };
        //const data = storage.get(constants.STORAGE_ENDPOINT, {});

        resolve(data);

      }))
      .then(endpoints => {
        context.commit(constants.MUTATION_ENDPOINT, endpoints);
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
};
