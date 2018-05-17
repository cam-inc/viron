const fs = require('fs');
const path = require('path');
const csv = require('csv');
const moment = require('moment-timezone');
const {find} = require('mout/array');
const {omit} = require('mout/object');

const shared = require('../shared');
const context = shared.context;

const dir = path.join(__dirname, '../public/img/user_video');
const imgUrl = `https://${context.getConfigHost()}/img/user_video/`;

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
  const props = omit(req.swagger.operation.responses['200'].schema.items.properties, 'video');
  const attributes = Object.keys(props);
  const limit = Number(req.query.limit);
  const offset = Number(req.query.offset);
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

      const filenames = fs.readdirSync(dir);

      return data.list.map(user => {
        const data = user.dataValues;
        // ファイルがあればURLを返す
        const name = find(filenames, name => `${user.id}` === (path.basename(name, path.extname(name))));
        if (name) {
          data.video = `${imgUrl}${name}`;
        }
        return data;
      });
    })
    .then(list => {
      res.json(list);
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
  const image = req.files.image && req.files.image[0];
  const video = req.files.video && req.files.video[0];
  const user = Object.assign({}, req.body);
  if (image) {
    user.thumbnail = image.buffer.toString('base64');
  }
  return storeHelper.create(store, Users, user)
    .then(data => {
      if (!video) {
        return data;
      }

      return new Promise((resolve, reject) => {
        const filename = `${data.id}${path.extname(video.originalname)}`;
        const filepath = path.join(dir, filename);
        fs.writeFile(filepath, video.buffer, err => {
          if (err) {
            return reject(err);
          }
          data.video = `${imgUrl}${filename}`;
          resolve(data);
        });
      });
    })
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
  const userId = req.swagger.params.id.value;
  const query = {id: userId};
  const options = {
    force: true, // physical delete
  };
  return storeHelper.remove(store, Users, query, options)
    .then(() => {
      const filenames = fs.readdirSync(dir);

      // ファイルがあれば削除する
      const name = find(filenames, name => `${userId}` === (path.basename(name, path.extname(name))));
      if (!name) {
        return;
      }
      return new Promise(resolve => fs.unlink(path.join(dir, name), resolve));
    })
    .then(() => {
      res.status(204).end();
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
  const userId = req.swagger.params.id.value;
  const query = {id: userId};
  const image = req.files.image && req.files.image[0];
  const video = req.files.video && req.files.video[0];
  const user = Object.assign({}, req.body);
  if (image) {
    user.thumbnail = image.buffer.toString('base64');
  }
  return storeHelper.update(store, Users, query, user)
    .then(data => {
      if (!video) {
        return data;
      }

      return new Promise((resolve, reject) => {
        const filename = `${userId}${path.extname(video.originalname)}`;
        const filepath = path.join(dir, filename);
        fs.writeFile(filepath, video.buffer, err => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      });
    })
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
  const file = req.files.image[0];
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
  'user#update': update,
  'user#upload': upload,
  'user#download': download,
};
