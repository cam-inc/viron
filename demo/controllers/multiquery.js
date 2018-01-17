const times = require('mout/function/times');
const filter = require('mout/array/filter');
const isEmpty = require('mout/lang/isEmpty');

const genData = (component, i) => {
  const _i = i + 1;
  return {
    component,
    id: `${component}${_i}`,
    name: `${component}${_i}-name`,
    age: Math.floor(Math.random() * (99 + 1 - 10)) + 10,
    address: `${component}${_i}-address`,
    job: `${component}${_i}-job`,
    detail: `${component}${_i}-detail`,
  };
};

const genList = (component, n) => {
  const result = [];
  times(n, i => {
    result.push(genData(component, i));
  });
  return result;
};

const dataA = genList('A', 10);
const dataB = genList('B', 10);
const dataC = genList('C', 10);
const dataD = genList('D', 10);
const dataE = genList('E', 10);

const list = (data, req, res) => {
  const query = req.query;
  delete query.limit;
  delete query.offset;
  if (isEmpty(query)) {
    return res.json(data);
  }

  const result = filter(data, query);
  res.json(result);
};

const listA = (req, res) => {
  return list(dataA, req, res);
};

const listB = (req, res) => {
  return list(dataB, req, res);
};

const listC = (req, res) => {
  return list(dataC, req, res);
};

const listD = (req, res) => {
  return list(dataD, req, res);
};

const listE = (req, res) => {
  return list(dataE, req, res);
};

module.exports = {
  'multiquery#a': listA,
  'multiquery#b': listB,
  'multiquery#c': listC,
  'multiquery#d': listD,
  'multiquery#e': listE,
};
