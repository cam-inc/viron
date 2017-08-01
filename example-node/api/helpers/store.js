const shared = require('../../shared');
const size = require('mout/object/size');
const isFinite = require('mout/lang/isFinite');

/**
 * find
 * @param {String} modelName
 * @param {Array} attributes - ['id', 'name', 'age']
 * @param {Object} where - {name: 'AAA'}
 * @param {Number} limit - 100
 * @param {Number} offset - 10
 * @param {Array} order - [['id', 'ASC'], ['name', 'DESC']]
 */
const find = (modelName, attributes, where, limit, offset, order) => {
  const m = shared.context.getStoreMain().models[modelName];
  const options = {};
  if (size(attributes)) {
    options.attributes = attributes;
  }
  if (where) {
    options.where = where;
  }
  if (isFinite(limit)) {
    options.limit = Number(limit);
  }
  if (isFinite(offset)) {
    options.offset = Number(offset);
  }
  if (size(order)) {
    options.order = order;
  }
  return m.findAll(options);
};

/**
 * count
 * @param {String} modelName
 * @param {Object} where - {name: 'AAA'}
 */
const count = (modelName, where) => {
  const m = shared.context.getStoreMain().models[modelName];
  const options = {};
  if (where) {
    options.where = where;
  }
  return m.count(options);
};

/**
 * create
 * @param {String} modelName
 * @param {Object} model
 */
const create = (modelName, model) => {
  const m = shared.context.getStoreMain().models[modelName];
  return m.create(model);
};

module.exports = {
  find,
  count,
  create,
};
