const data = [
  {
    id: 'd1',
    str: 'hoge',
    bool: false,
    num: 222,
    arr: [
      {
        str: 'fuga',
        bool: true,
        num: 888,
      },
    ],
    obj: {
      str: 'foo',
      bool: true,
      num: 777,
    },
  },
];

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
  'default#list': list,
  'default#create': create,
  'default#update': update,
};
