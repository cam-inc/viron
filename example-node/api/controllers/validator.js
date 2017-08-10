const data = [
  {
    id: 1,
    validation_type: 'multipleOf',
    multiple_of: 9,
  },
  {
    id: 2,
    validation_type: 'maximum',
    maximum: 10,
  },
  {
    id: 3,
    validation_type: 'exclusiveMaximum',
    exclusive_maximum: 9,
  },
  {
    id: 4,
    validation_type: 'minimum',
    minimum: 1,
  },
  {
    id: 5,
    validation_type: 'exclusiveMinumum',
    exclusive_minimum: 2,
  },
  {
    id: 6,
    validation_type: 'min-max',
    min_max: 5,
  },
  {
    id: 7,
    validation_type: 'maxLength',
    max_length: 'abcdefghijklmnopqrst',
  },
  {
    id: 8,
    validation_type: 'minLength',
    max_length: 'abcde'
  },
  {
    id: 9,
    validation_type: 'min-max-length',
    min_max_length: 'abcdefghij',
  },
  {
    id: 10,
    validation_type: 'pattern',
    pattern: 'abcde',
  },
  {
    id: 11,
    validation_type: 'maxItems',
    max_items: [
      {value: 'aaa'},
      {value: 'bbb'},
      {value: 'ccc'}
    ],
  },
  {
    id: 12,
    validation_type: 'minItems',
    min_items: [
      {value: 'aaa'},
      {value: 'bbb'}
    ],
  },
  {
    id: 13,
    validation_type: 'uniqueItems',
    unique_items: [
      {value: 'aaa'},
      {value: 'bbb'}
    ],
  },
  {
    id: 14,
    validation_type: 'maxProperties',
    max_properties: {
      key1: 'aaaaa',
      key2: 999,
      key3: true,
    },
  },
  {
    id: 15,
    validation_type: 'minProperties',
    min_properties: {
      key1: 'aaaaa',
      key2: 999,
    },
  },
  {
    id: 16,
    validation_type: 'allOf',
    all_of: 'abcdefghij',
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
  'validator#list': list,
  'validator#create': create,
  'validator#update': update,
};
