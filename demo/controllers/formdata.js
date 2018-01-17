const data = {
  string: ['this', 'is', 'a', 'string', 'array'],
  number: [111111, 222222, 333333, 444444, 555555, 666666, 777777],
  boolean: [true, false, false, true, true, false, true],
};

const show = (req, res) => {
  const type = req.path.split('/').pop();
  res.json(data[type]);
};

const create = (req, res) => {
  const type = req.path.split('/').pop();
  data[type].push(req.body.form);
  res.json(data[type]);
};

module.exports = {
  'formdata#string#show': show,
  'formdata#string#create': create,
  'formdata#number#show': show,
  'formdata#number#create': create,
  'formdata#boolean#show': show,
  'formdata#boolean#create': create,
};
