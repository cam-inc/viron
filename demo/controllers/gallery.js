const fs = require('fs');
const path = require('path');

const uuid = require('uuid');

const {context} = require('../shared');

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
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  const all = fs.readdirSync(dir).sort();
  let filtered = all;
  if (req.query.id) {
    filtered = all.filter(id => id.includes(req.query.id));
  }
  const list = filtered.slice(offset, limit + offset).map(name => {
    return {
      id: name,
      url: `${imgUrl}${name}`,
    };
  });

  pager.setResHeader(res, limit, offset, filtered.length);
  res.json(list);
};

/**
 * Controller : Upload Gallery
 * HTTP Method : POST
 * PATH : /gallery
 */
const upload = (req, res, next) => {
  const file = req.files.image[0];
  const name = `${uuid.v4()}${path.extname(file.originalname)}`;
  const filepath = path.join(dir, name);

  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, file.buffer, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  })
    .then(() => {
      res.json({
        id: name,
        url: `${imgUrl}${name}`,
      });
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
