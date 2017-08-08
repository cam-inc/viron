const models = require('./models');
const helper = require('./helper');

const initModel = model => {
  return new Promise((resolve, reject) => {
    if (!model.sync) {
      return resolve();
    }
    model
      .sync()
      .then(resolve)
      .catch(reject)
    ;
  });
};

const initModels = sequelize => {
  return new Promise((resolve, reject) => {
    const tasks = Object.keys(models).map(name => {
      if (typeof models[name] !== 'function') {
        return Promise.resolve();
      }
      return initModel(models[name](sequelize));
    });
    return Promise.all(tasks)
      .then(() => {
        resolve(sequelize);
      })
      .catch(reject)
    ;
  });
};

module.exports = {
  /**
   * Model Define
   */
  models: models,

  /**
   * Helper functions
   */
  helper: helper,

  /**
   * 初期化
   * @param sequelize Sequelize instance
   */
  init: sequelize => {
    return Promise.resolve()
      .then(() => {
        return sequelize;
      })
      .then(sequelize => {
        return initModels(sequelize);
      })
    ;
  },

};
