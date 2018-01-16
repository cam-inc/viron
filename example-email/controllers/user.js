let data = [
  {
    id: 1,
    name: '山田 太郎',
    sex: 'male',
    job: '大学生',
    blood_type: 'A',
    birthday: '1995-05-12T09:45:56.000Z',
    createdAt: '2017-04-14T11:16:32.000Z',
    updatedAt: '2917-04-27T12:25:11.000Z',
  },
];

/**
 * Controller : List  User
 * HTTP Method : GET
 * PATH : /user
 */
const list = (req, res) => {
  return res.json(data);
};

/**
 * Controller : Create  User
 * HTTP Method : POST
 * PATH : /user
 */
const create = (req, res) => {
  const body = req.body;
  const file = req.files.image && req.files.image[0];
  if (file) {
    body.thumbnail = file.buffer.toString('base64');
  }
  data.push(body);
  res.json(body);
};

/**
 * Controller : Delete  User
 * HTTP Method : DELETE
 * PATH : /user/:id
 */
const remove = (req, res) => {
  data = data.filter(obj => obj.id !== req.swagger.params.id.value);
  res.status(204).end();
};

/**
 * Controller : update  User
 * HTTP Method : PUT
 * PATH : /user/:id
 */
const update = (req, res) => {
  const body = req.body;
  const file = req.files.image && req.files.image[0];
  if (file) {
    body.thumbnail = file.buffer.toString('base64');
  }
  let i;
  for (i in data) {
    const obj = data[i];
    if (obj.id === req.swagger.params.id.value) {
      body.updatedAt = new Date().toISOString();
      Object.assign(data[i], body);
      break;
    }
  }
  res.json(data[i]);
};

module.exports = {
  'user#list': list,
  'user#create': create,
  'user#remove': remove,
  'user#update': update,
};
