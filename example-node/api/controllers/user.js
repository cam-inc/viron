const csvParse = require('csv-parse');

const shared = require('../../shared');
const context = shared.context;

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const list = (req, res) => {
  const dmclib = context.getDmcLib();
  const pager = dmclib.pager;
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const attributes = Object.keys(req.swagger.operation.responses['200'].schema.items.properties);
  const limit = req.query.limit;
  const offset = req.query.offset;
  const options = {
    attributes,
    limit,
    offset,
  };
  const query = {};
  if (req.swagger.params.name.value) {
    query.where = {name: {$like: `${req.swagger.params.name.value}%`}};
  }
  return storeHelper.list(store, Users, query, options)
    .then(data => {
      pager.setResHeader(res, limit, offset, data.count);
      res.json(data.list);
    })
  ;
};

/**
 * Controller : Create  User
 * HTTP Method : POST
 * PATH : /user
 *
 * @returns {Promise.<TResult>}
 */
const create = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  return storeHelper.create(store, Users, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, Users, query, options)
    .then(() => {
      res.status(204).end();
    })
  ;
};

/**
 * Controller : Show  User
 * HTTP Method : GET
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  const options = {
    attributes: Object.keys(req.swagger.operation.responses['200'].schema.properties),
  };
  return storeHelper.findOne(store, Users, query, options)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res) => {
  const dmclib = context.getDmcLib();
  const storeHelper = dmclib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, Users, query, req.body)
    .then(data => {
      res.json(data);
    })
  ;
};

/**
 * Controller : upload Users
 * HTTP Method : PUT
 * PATH : /user/upload/csv
 *
 * @returns {Promise.<TResult>}
 */
const upload = (req, res) => {
  const file = req.files.payload[0];
  if (file.mimetype !== 'text/csv') {
    console.warn(`invalid file format: ${file.originalname}`);
    return res.json({});
  }

  csvParse(file.buffer.toString(), {columns: true}, (err, data) => {
    if (err) {
      console.error(err);
      return res.json({});
    }

    // あとはDBに入れるだけ
    console.log(data);
    res.json({});
  });
};


module.exports = {
  'user#list': list,
  'user#create': create,
  'user#remove': remove,
  'user#show': show,
  'user#update': update,
  'user#upload': upload,
};
