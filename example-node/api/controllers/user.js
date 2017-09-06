const csv = require('csv');
const moment = require('moment-timezone');

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
  const vironlib = context.getVironLib();
  const pager = vironlib.pager;
  const storeHelper = vironlib.stores.helper;
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
  if (req.query.name) {
    query.name = {$like: `${req.query.name}%`};
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
const create = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  return storeHelper.create(store, Users, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const remove = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
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
    .catch(next)
  ;
};

/**
 * Controller : Show  User
 * HTTP Method : GET
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const show = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
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
    .catch(next)
  ;
};

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 *
 * @returns {Promise.<TResult>}
 */
const update = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const query = {
    id: req.swagger.params.id.value,
  };
  return storeHelper.update(store, Users, query, req.body)
    .then(data => {
      res.json(data);
    })
    .catch(next)
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

  csv.parse(file.buffer.toString(), {columns: true}, (err, data) => {
    if (err) {
      console.error(err);
      return res.json({});
    }

    // あとはDBに入れるだけ
    console.log(data);
    res.json({});
  });
};

/**
 * Controller : download Users
 * HTTP Method : GET
 * PATH : /user/download/csv
 *
 * @returns {Promsie.<TResult>}
 */
const download = (req, res, next) => {
  const vironlib = context.getVironLib();
  const storeHelper = vironlib.stores.helper;
  const store = context.getStoreMain();
  const Users = store.models.Users;
  const attributes = ['id', 'name', 'job', 'birthday', 'blood_type', 'sex'];
  const options = {
    attributes,
    limit: 100000000,
    offset: 0,
  };
  const query = {};
  return storeHelper.list(store, Users, query, options)
    .then(data => {
      return new Promise((resolve, reject) => {
        csv.stringify(data.list, {
          columns: attributes,
          delimiter: ',',
          escape: '\\',
          eof: false,
          header: true,
          quoted: true,
          quotedEmpty: true,
          quotedString: true,
        }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    })
    .then(data => {
      const name = `user_${moment().tz('Asia/Tokyo').format('YYYYMMDDHHmmss')}.csv`;
      res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
      res.send(data);
    })
    .catch(next)
  ;
};

module.exports = {
  'user#list': list,
  'user#create': create,
  'user#remove': remove,
  'user#show': show,
  'user#update': update,
  'user#upload': upload,
  'user#download': download,
};
