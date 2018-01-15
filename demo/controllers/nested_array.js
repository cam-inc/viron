const data = [
  {
    id: 1,
    values: [
      [
        [
          {name: 'AAA', age: 20},
          {name: 'BBB', age: 22},
          {name: 'CCC', age: 24},
        ],
        [
          {name: 'DDD', age: 21},
          {name: 'EEE', age: 23},
          {name: 'FFF', age: 25},
        ],
      ],
      [
        [
          {name: 'GGG', age: 30},
          {name: 'HHH', age: 32},
          {name: 'III', age: 34},
        ],
        [
          {name: 'JJJ', age: 31},
          {name: 'KKK', age: 33},
          {name: 'LLL', age: 35},
        ],
      ],
      [
        [
          {name: 'XXX', age: 50},
        ],
        [
          {name: 'YYY', age: 51},
        ],
        [
          {name: 'ZZZ', age: 52},
        ],
      ]
    ],
    string_array: ['this', 'is', 'a', 'string', 'array'],
    number_array: [111111, 222222, 333333, 444444, 555555, 666666, 777777, 888888, 999999],
    bool_array: [true, false, false, true, true, false],
  },
];

const list = (req, res) => {
  res.json(data);
};

const create = (req, res) => {
  data.push(req.body);
  res.json(data);
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
  'nested_array#list': list,
  'nested_array#create': create,
  'nested_array#update': update,
};
