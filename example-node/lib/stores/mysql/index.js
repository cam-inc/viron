const reduce = require('mout/object/reduce');

const models = require('./models');

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

  functions: {
    /**
     * 接続テスト
     */
    ping: sequelize => {
      return sequelize.authenticate();
    },
    /**
     * オプション取得
     */
    getOptions: sequelize => {
      return sequelize.config;
    },
    /**
     * モデル生成
     */
    defineModels: (sequelize, models) => {
      return reduce(models, (ret, model, name) => {
        if (typeof model === 'function') {
          ret[name] = model(sequelize);
        }
        return ret;
      }, {});
    },
  },

};
