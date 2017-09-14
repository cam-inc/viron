const Sequelize = require('sequelize');
const reduce = require('mout/object/reduce');
const vironlibStores = require('node-vironlib/stores');

const models = require('./models');
const associations = models.associations;

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

const initAssociations = sequelize => {
  return new Promise((resolve, reject) => {
    const tasks = Object.keys(associations).map(name => {
      return associations[name](sequelize);
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
  models: Object.assign(models, vironlibStores.mysql.models),

  /**
   * Helper functions
   */
  helper: vironlibStores.mysql.helper,

  /**
   * MySQL コネクション作成
   * @param options http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor
   * @returns {Bluebird<U>|Bluebird<U2|U1>|Bluebird<R>|Thenable<U>|Promise.<TResult>}
   */
  init: options => {
    const sequelize = new Sequelize(options.config);

    return sequelize.authenticate()
      .then(() => {
        return sequelize;
      })
      .then(sequelize => {
        return vironlibStores.mysql.init(sequelize); // import viron library
      })
      .then(sequelize => {
        return initModels(sequelize);
      })
      .then(sequelize => {
        return initAssociations(sequelize);
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
