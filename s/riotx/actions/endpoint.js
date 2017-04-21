import constants from '../../core/constants';

export default {
  show: context => {
    return Promise
      .resolve()
      .then(() => new Promise(resolve => {

        // TODO: あとで store.js に変える
        const data = {
          'http://localhost:3000/swagger.json': { name: 'Service A', tags: ['local'] },
          'http://localhost:3001/swagger.json': { name: 'Service A', tags: ['Development'] },
          'http://localhost:3002/swagger.json': { name: 'Service A', tags: ['Staging'] },
          'http://localhost:3003/swagger.json': { name: 'Service A', tags: ['Production'] },
          'http://localhost:3004/swagger.json': { name: 'Service B', tags: ['Local'] },
          'http://localhost:3005/swagger.json': { name: 'Service B', tags: ['Development'] },
          'http://localhost:3006/swagger.json': { name: 'Service B', tags: ['Staging'] },
          'http://localhost:3007/swagger.json': { name: 'Service B', tags: ['Production'] }
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
