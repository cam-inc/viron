const data = [];

const list = (req, res) => {
  res.json(data);
};

const create = (req, res) => {
  data.push(req.body);
  res.json(req.body);
};

const update = (req, res) => {
  let i;
  for (i in data) {
    const obj = data[i];
    if (obj.id === req.swagger.params.id.value) {
      data[i] = req.body;
      break;
    }
  }
  res.json(data[i]);
};

module.exports = {
  'date_format#list': list,
  'date_format#create': create,
  'date_format#update': update,
};
