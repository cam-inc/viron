export default {
  show: mutate => {
    return Promise
      .resolve()
      .then(() => new Promise(resolve => {
        // TODO: localStorageなりAjaxなりで非同期にデータを取得した想定
        window.setTimeout(() => {
          resolve({
            'http://localhost:3000/swagger.json': { name: 'Service A', tags: ['local'] },
            'http://localhost:3001/swagger.json': { name: 'Service A', tags: ['Development'] },
            'http://localhost:3002/swagger.json': { name: 'Service A', tags: ['Staging'] },
            'http://localhost:3003/swagger.json': { name: 'Service A', tags: ['Production'] },
            'http://localhost:3004/swagger.json': { name: 'Service B', tags: ['Local'] },
            'http://localhost:3005/swagger.json': { name: 'Service B', tags: ['Development'] },
            'http://localhost:3006/swagger.json': { name: 'Service B', tags: ['Staging'] },
            'http://localhost:3007/swagger.json': { name: 'Service B', tags: ['Production'] }
          });
        }, 1000 * 3);
      }))
      .then(endpoints => {
        mutate('endpoint_show', endpoints);
        // TODO
        return {
          foo: 'sample response from acion.'
        };
      });
  }
};
