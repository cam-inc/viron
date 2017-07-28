const helperStore = require('../helpers/store');
const lib = require('../../lib');

const pager = lib.pager;

/**
 * GET: /adminuser
 */
const list = (req, res) => {
  const fields = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  // 全件取得
  //helperStore.find('AdminUsers', fields)
  //  .then(list => {
  //    res.json(list);
  //  })
  //;

  // ページネーション
  const limit = req.query.limit;
  const offset = req.query.offset;
  return Promise.resolve()
    .then(() => {
      return helperStore.count('AdminUsers');
    })
    .then(count => {
      pager.setResHeader(res, limit, offset, count);
      return helperStore.find('AdminUsers', fields, null, limit, offset);
    })
    .then(list => {
      res.json(list);
    })
  ;
};

const create = (req, res) => {
  res.json({});
};

const get = (req, res) => {
  res.json({});
};

const remove = (req, res) => {
  res.json({});
};

const update = (req, res) => {
  res.json({});
};

module.exports = {
  'admin_user#list': list,
  'admin_user#create': create,
  'admin_user#get': get,
  'admin_user#remove': remove,
  'admin_user#update': update,
};
