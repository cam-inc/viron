/**
 * GET: /stats/chart/bar
 */
const bar = (req, res) => {
  res.json({
    data: [
      {year: '2010', dau: 133},
      {year: '2011', dau: 165},
      {year: '2012', dau: 198},
      {year: '2013', dau: 524},
      {year: '2014', dau: 1203},
      {year: '2015', dau: 2239},
      {year: '2016', dau: 2380},
      {year: '2017', dau: 4060},
      {year: '2018', dau: 5530},
    ],
    x: 'year',
    y: 'dau',
    guide: {
      x: {label: 'year'},
      y: {label: 'DAU'},
    },
  });
};

/**
 * GET: /stats/chart/horizontal-bar
 */
const horizontalBar = (req, res) => {
  res.json({
    data: [
      {year: '2010', mau: 260},
      {year: '2011', mau: 311},
      {year: '2012', mau: 375},
      {year: '2013', mau: 1028},
      {year: '2014', mau: 2504},
      {year: '2015', mau: 5112},
      {year: '2016', mau: 6087},
      {year: '2017', mau: 8992},
      {year: '2018', mau: 12565},
    ],
    x: 'mau',
    y: 'year',
    guide: {
      x: {label: 'MAU'},
      y: {label: 'year'},
    },
  });
};

/**
 * GET: /stats/chart/horizontal-stacked-bar
 */
const horizontalStackedBar = (req, res) => {
  res.json({
    x: 'earning',
    y: 'year',
    color: 'product',
    data: [
      {year: '2017', product: 'A', earning: 43},
      {year: '2017', product: 'B', earning: 121},
      {year: '2017', product: 'C', earning: 45},
      {year: '2017', product: 'D', earning: 510},
      {year: '2017', product: 'E', earning: 223},
      {year: '2016', product: 'A', earning: 77},
      {year: '2016', product: 'B', earning: 61},
      {year: '2016', product: 'C', earning: 24},
      {year: '2016', product: 'D', earning: 240},
      {year: '2016', product: 'E', earning: 150},
      {year: '2015', product: 'A', earning: 100},
      {year: '2015', product: 'B', earning: 50},
      {year: '2015', product: 'C', earning: 15},
      {year: '2015', product: 'D', earning: 210},
      {year: '2015', product: 'E', earning: 68},
      {year: '2014', product: 'A', earning: 121},
      {year: '2014', product: 'B', earning: 44},
      {year: '2014', product: 'C', earning: 10},
      {year: '2014', product: 'D', earning: 140},
      {year: '2014', product: 'E', earning: 31},
      {year: '2013', product: 'A', earning: 145},
      {year: '2013', product: 'B', earning: 33},
      {year: '2013', product: 'C', earning: 9},
      {year: '2013', product: 'D', earning: 130},
      {year: '2013', product: 'E', earning: 0},
      {year: '2012', product: 'A', earning: 150},
      {year: '2012', product: 'B', earning: 22},
      {year: '2012', product: 'C', earning: 8},
      {year: '2012', product: 'D', earning: 110},
      {year: '2012', product: 'E', earning: 0},
      {year: '2011', product: 'A', earning: 152},
      {year: '2011', product: 'B', earning: 11},
      {year: '2011', product: 'C', earning: 7},
      {year: '2011', product: 'D', earning: 90},
      {year: '2011', product: 'E', earning: 0},
      {year: '2010', product: 'A', earning: 161},
      {year: '2010', product: 'B', earning: 1},
      {year: '2010', product: 'C', earning: 6},
      {year: '2010', product: 'D', earning: 20},
      {year: '2010', product: 'E', earning: 0},
    ]
  });
};

/**
 * GET: /stats/chart/line
 */
const line = (req, res) => {
  res.json({
    data: [
      {year: '2010', product: 'A', member: 193082},
      {year: '2010', product: 'B', member: 2001},
      {year: '2010', product: 'C', member: 192},
      {year: '2010', product: 'D', member: 67534},
      {year: '2010', product: 'E', member: 0},
      {year: '2011', product: 'A', member: 201101},
      {year: '2011', product: 'B', member: 2934},
      {year: '2011', product: 'C', member: 659},
      {year: '2011', product: 'D', member: 99182},
      {year: '2011', product: 'E', member: 0},
      {year: '2012', product: 'A', member: 198201},
      {year: '2012', product: 'B', member: 6123},
      {year: '2012', product: 'C', member: 1012},
      {year: '2012', product: 'D', member: 129993},
      {year: '2012', product: 'E', member: 0},
      {year: '2013', product: 'A', member: 181232},
      {year: '2013', product: 'B', member: 10123},
      {year: '2013', product: 'C', member: 2201},
      {year: '2013', product: 'D', member: 169011},
      {year: '2013', product: 'E', member: 0},
      {year: '2014', product: 'A', member: 159012},
      {year: '2014', product: 'B', member: 12151},
      {year: '2014', product: 'C', member: 4012},
      {year: '2014', product: 'D', member: 190302},
      {year: '2014', product: 'E', member: 1024},
      {year: '2015', product: 'A', member: 159012},
      {year: '2015', product: 'B', member: 19151},
      {year: '2015', product: 'C', member: 8012},
      {year: '2015', product: 'D', member: 190302},
      {year: '2015', product: 'E', member: 4022},
      {year: '2016', product: 'A', member: 120000},
      {year: '2016', product: 'B', member: 22151},
      {year: '2016', product: 'C', member: 10012},
      {year: '2016', product: 'D', member: 190302},
      {year: '2016', product: 'E', member: 40123},
      {year: '2017', product: 'A', member: 100000},
      {year: '2017', product: 'B', member: 32151},
      {year: '2017', product: 'C', member: 20012},
      {year: '2017', product: 'D', member: 190302},
      {year: '2017', product: 'E', member: 340873},
    ],
    x: 'year',
    y: 'member',
    split: 'product',
    color: 'product',
    guide: {
      x: {label: '年'},
      y: {label: '会員数'},
    },
  });
};

/**
 * GET: /stats/chart/scatterplot
 */
const scatterplot = (req, res) => {
  res.json({
    data: [
      {country: 'Belgium', fat: 95, sugar: 95, size: 10},
      {country: 'Germany', fat: 86.5, sugar: 102.9, size: 9},
      {country: 'Finland', fat: 80.8, sugar: 91.5, size: 8},
      {country: 'Netherlands', fat: 80.4, sugar: 102.5, size: 7},
      {country: 'Sweden', fat: 80.3, sugar: 96.1, size: 6},
      {country: 'Spain', fat: 78.4, sugar: 70.1, size: 5},
      {country: 'France', fat: 74.2, sugar: 68.5, size: 4},
      {country: 'Norway', fat: 73.5, sugar: 83.1, size: 3},
      {country: 'United Kingdom', fat: 71, sugar: 93.2, size: 2},
      {country: 'Italy', fat: 69.2, sugar: 57.6, size: 1},
    ],
    x: 'fat',
    y: 'sugar',
    size: 'size',
    color: 'country',
    guide: {
      x: {label: 'Fat', nice: false},
      y: {label: 'Sugar', nice: false},
      size: {minSize: 1, maxSize: 100},
    },
  });
};

/**
 * GET: /stats/chart/stacked-area
 */
const stackedArea = (req, res) => {
  res.json({
    x: 'date',
    y: 'effort',
    color: 'team',
    data: [
      {team: 'Alpha', date: '2015-07-15', effort: 400},
      {team: 'Alpha', date: '2015-07-16', effort: 200},
      {team: 'Alpha', date: '2015-07-17', effort: 300},
      {team: 'Alpha', date: '2015-07-18', effort: 500},
      {team: 'Beta', date: '2015-07-15', effort: 100},
      {team: 'Beta', date: '2015-07-16', effort: 200},
      {team: 'Beta', date: '2015-07-17', effort: 300},
      {team: 'Beta', date: '2015-07-18', effort: 100},
      {team: 'Gamma', date: '2015-07-15', effort: 300},
      {team: 'Gamma', date: '2015-07-16', effort: 100},
      {team: 'Gamma', date: '2015-07-17', effort: 100},
      {team: 'Gamma', date: '2015-07-18', effort: 200}
    ]
  });
};

/**
 * GET: /stats/chart/stacked-bar
 */
const stackedBar = (req, res) => {
  res.json({
    data: [
      {year: '2010', product: 'A', earning: 161},
      {year: '2010', product: 'B', earning: 1},
      {year: '2010', product: 'C', earning: 6},
      {year: '2010', product: 'D', earning: 20},
      {year: '2010', product: 'E', earning: 0},
      {year: '2011', product: 'A', earning: 152},
      {year: '2011', product: 'B', earning: 11},
      {year: '2011', product: 'C', earning: 7},
      {year: '2011', product: 'D', earning: 90},
      {year: '2011', product: 'E', earning: 0},
      {year: '2012', product: 'A', earning: 150},
      {year: '2012', product: 'B', earning: 22},
      {year: '2012', product: 'C', earning: 8},
      {year: '2012', product: 'D', earning: 110},
      {year: '2012', product: 'E', earning: 0},
      {year: '2013', product: 'A', earning: 145},
      {year: '2013', product: 'B', earning: 33},
      {year: '2013', product: 'C', earning: 9},
      {year: '2013', product: 'D', earning: 130},
      {year: '2013', product: 'E', earning: 0},
      {year: '2014', product: 'A', earning: 121},
      {year: '2014', product: 'B', earning: 44},
      {year: '2014', product: 'C', earning: 10},
      {year: '2014', product: 'D', earning: 140},
      {year: '2014', product: 'E', earning: 31},
      {year: '2015', product: 'A', earning: 100},
      {year: '2015', product: 'B', earning: 50},
      {year: '2015', product: 'C', earning: 15},
      {year: '2015', product: 'D', earning: 210},
      {year: '2015', product: 'E', earning: 68},
      {year: '2016', product: 'A', earning: 77},
      {year: '2016', product: 'B', earning: 61},
      {year: '2016', product: 'C', earning: 24},
      {year: '2016', product: 'D', earning: 240},
      {year: '2016', product: 'E', earning: 150},
      {year: '2017', product: 'A', earning: 43},
      {year: '2017', product: 'B', earning: 121},
      {year: '2017', product: 'C', earning: 45},
      {year: '2017', product: 'D', earning: 510},
      {year: '2017', product: 'E', earning: 223},
    ],
    guide: {
      y: {label: '売上'},
      x: {label: '年'},
    },
    x: 'year',
    y: 'earning',
    color: 'product',
  });
};

module.exports = {
  'stats_chart#bar': bar,
  'stats_chart#scatterplot': scatterplot,
  'stats_chart#line': line,
  'stats_chart#horizontal-bar': horizontalBar,
  'stats_chart#stacked-bar': stackedBar,
  'stats_chart#horizontal-stacked-bar': horizontalStackedBar,
  'stats_chart#stacked-area': stackedArea,
};
