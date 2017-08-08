/**
 * create
 * @param {Object} store
 * @param {Sequelize.Model} model
 * @param {Object} data
 */
const create = (store, ...args) => {
  return store.helper.create(...args);
};

/**
 * list
 * @param {Object} store
 * @param {Sequelize.Model} model
 * @param {Object} query - {name: 'AAA'}
 * @param {Object} options
 * @param {Array} options.attributes - ['id', 'name', 'age']
 * @param {number} options.limit
 * @param {number} options.offset
 * @param {Array} options.order - [['name', 'DESC']]
 */
const list = (store, ...args) => {
  return Promise.resolve()
    .then(() => {
      return store.helper.find(...args);
    })
    .then(list => {
      const _args = [args[0], args[1]];
      return store.helper.count(..._args)
        .then(count => {
          return {count, list};
        })
      ;
    })
  ;
};

/**
 * remove
 * @param {Object} store
 * @param {Sequelize.Model} model
 * @param {Object} query - {name: 'AAA'}
 * @param {Object} options
 */
const remove = (store, ...args) => {
  return store.helper.remove(...args);
};

/**
 * get
 * @param {Object} store
 * @param {Sequelize.Model} model
 * @param {Object} query - {name: 'AAA'}
 * @param {Object} options
 * @param {Array} options.attributes - ['id', 'name', 'age']
 */
const findOne = (store, ...args) => {
  return store.helper.findOne(...args);
};

/**
 * update
 * @param {Object} store
 * @param {Sequelize.Model} model
 * @param {Object} query - {name: 'AAA'}
 * @param {Object} data
 * @param {Object} options
 */
const update = (store, ...args) => {
  return store.helper.update(...args);
};

module.exports = {
  list,
  findOne,
  create,
  remove,
  update,
};
