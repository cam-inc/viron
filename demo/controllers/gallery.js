const fs = require('fs');
const path = require('path');

const uuid = require('uuid');

const {constant, context} = require('../shared');

const dir = path.join(__dirname, '../public/img/gallery');
const imgUrl = `https://${context.getConfigHost()}/img/gallery/`;

/**
 * Controller : List Gallery
 * HTTP Method : GET
 * PATH : /gallery
 */
const list = (req, res) => {
  const vironlib = context.getVironLib();
  const {pager} = vironlib;
  const limit = Number(req.query.limit) || constant.DEFAULT_PAGER_LIMIT;
  const offset = Number(req.query.offset) || 0;

  const all = fs.readdirSync(dir).sort();
  const list = all.slice(offset, limit + offset).map(name => {
    return {
      id: name,
      url: `${imgUrl}${name}`,
    };
  });

  pager.setResHeader(res, limit, offset, all.length);
  res.json(list);
};

/**
 * Controller : Upload Gallery
 * HTTP Method : POST
 * PATH : /gallery
 */
const upload = (req, res, next) => {
  const file = req.files.image[0];
  const filepath = path.join(dir, `${uuid.v4()}${path.extname(file.originalname)}`);

  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, file.buffer, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

/**
 * Controller : Delete Gallery
 * HTTP Method : DELETE
 * PATH : /gallery/:id
 */
const remove = (req, res, next) => {
  const id = req.swagger.params.id.value;
  const filepath = path.join(dir, id);

  return new Promise((resolve, reject) => {
    fs.unlink(filepath, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next)
  ;
};

module.exports = {
  'gallery#list': list,
  'gallery#upload': upload,
  'gallery#remove': remove,
};
