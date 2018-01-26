const data = [
  {
    id: 1,
    date_time: '2006-02-12T07:09:13+09:00',
    email: 'user@example.com',
    hostname: 'example.com',
    ipv4: '127.0.0.1',
    ipv6: 'FEDC:BA98:7654:3210:FEDC:BA98:7654:3210',
    uri: 'https://example.com/swagger.json',
    multiline: 'aaaaaaaaaaa\nbbbbbbbbbbb\ncccccccccc',
    wyswyg: '<html><body><div>hoge</div></body></html>',
    hex: '#95989A',
    rgba: '171,205,239,1',
    cmyk: '100,100,100,100',
    date_fullyear: '1970',
    date_month: '01',
    date_mday: '31',
    time_hour: '23',
    time_minute: '59',
    time_second: '59',
    time_secfrac: '.999',
    time_numoffset: '+09:00',
    time_offset: 'Z',
    partial_time: '23:59:59.999',
    full_date: '1970-12-31',
    full_time: '23:59:59.999Z',
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
  'format#list': list,
  'format#create': create,
  'format#update': update,
};
