/**
 * GET: /stats/planet/bar
 */
const bar = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387},
      {name: '金星', distance: 0.723},
      {name: '地球', distance: 1.000},
      {name: '火星', distance: 1.524},
      {name: '木星', distance: 5.203},
      {name: '土星', distance: 9.539},
      {name: '天王星', distance: 19.180},
      {name: '海王星', distance: 30.060},
      {name: '冥王星', distance: 39.530},
    ],
    x: 'name',
    y: 'distance',
    guide: {
      x: {label: '名前'},
      y: {label: '距離'},
    },
  });
};

/**
 * GET: /stats/planet/horizontal-bar
 */
const horizontalBar = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387},
      {name: '金星', distance: 0.723},
      {name: '地球', distance: 1.000},
      {name: '火星', distance: 1.524},
      {name: '木星', distance: 5.203},
      {name: '土星', distance: 9.539},
      {name: '天王星', distance: 19.180},
      {name: '海王星', distance: 30.060},
      {name: '冥王星', distance: 39.530},
    ],
    x: 'distance',
    y: 'name',
    guide: {
      x: {label: '距離'},
      y: {label: '名前'},
    },
  });
};

/**
 * GET: /stats/planet/horizontal-stacked-bar
 */
const horizontalStackedBar = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387},
      {name: '金星', distance: 0.723},
      {name: '地球', distance: 1.000},
      {name: '火星', distance: 1.524},
      {name: '木星', distance: 5.203},
      {name: '土星', distance: 9.539},
      {name: '天王星', distance: 19.180},
      {name: '海王星', distance: 30.060},
      {name: '冥王星', distance: 39.530},
    ],
    x: 'distance',
    y: 'name',
    guide: {
      x: {label: '距離'},
      y: {label: '名前'},
    },
  });
};

/**
 * GET: /stats/planet/line
 */
const line = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387, temperature: 452},
      {name: '金星', distance: 0.723, temperature: 726},
      {name: '地球', distance: 1.000, temperature: 281},
      {name: '火星', distance: 1.524, temperature: 230},
      {name: '木星', distance: 5.203, temperature: 120},
      {name: '土星', distance: 9.539, temperature: 88},
      {name: '天王星', distance: 19.180, temperature: 59},
      {name: '海王星', distance: 30.060, temperature: 48},
      {name: '冥王星', distance: 39.530, temperature: 37},
    ],
    x: 'name',
    y: 'distance',
    color: 'albedo',
    guide: {
      x: {label: '名前'},
      y: {label: '距離'},
    },
  });
};

/**
 * GET: /stats/planet/scatterplot
 */
const scatterplot = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387, temperature: 452, albedo: 0.1},
      {name: '金星', distance: 0.723, temperature: 726, albedo: 0.6},
      {name: '地球', distance: 1.000, temperature: 281, albedo: 0.4},
      {name: '火星', distance: 1.524, temperature: 230, albedo: 0.2},
      {name: '木星', distance: 5.203, temperature: 120, albedo: 0.4},
      {name: '土星', distance: 9.539, temperature: 88, albedo: 0.5},
      {name: '天王星', distance: 19.180, temperature: 59, albedo: 0.6},
      {name: '海王星', distance: 30.060, temperature: 48, albedo: 0.5},
      {name: '冥王星', distance: 39.530, temperature: 37, albedo: 0.5},
    ],
    x: 'name',
    y: 'distance',
    size: 'temperature',
    color: 'albedo',
    guide: {
      x: {label: '名前'},
      y: {label: '距離'},
    },
  });
};

/**
 * GET: /stats/planet/stacked-area
 */
const stackedArea = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0, temperature: 452},
      {name: '水星', distance: 1, temperature: 726},
      {name: '水星', distance: 2, temperature: 281},
      {name: '火星', distance: 0, temperature: 230},
      {name: '火星', distance: 1, temperature: 120},
      {name: '火星', distance: 2, temperature: 88},
      {name: '天王星', distance: 0, temperature: 59},
      {name: '天王星', distance: 1, temperature: 48},
      {name: '天王星', distance: 2, temperature: 37},
    ],
    x: 'distance',
    y: 'temperature',
    color: 'name',
    guide: {
      x: {label: '距離'},
      y: {label: '温度'},
    },
  });
};

/**
 * GET: /stats/planet/stacked-bar
 */
const stackedBar = (req, res) => {
  res.json({
    data: [
      {name: '水星', distance: 0.387},
      {name: '水星', distance: 0.723},
      {name: '水星', distance: 1.000},
      {name: '火星', distance: 1.524},
      {name: '火星', distance: 5.203},
      {name: '火星', distance: 9.539},
      {name: '天王星', distance: 19.180},
      {name: '天王星', distance: 30.060},
      {name: '天王星', distance: 39.530},
    ],
    x: 'name',
    y: 'distance',
    guide: {
      y: {label: '名前'},
      x: {label: '距離'},
    },
  });
};

module.exports = {
  'stats_planet#bar': bar,
  'stats_planet#horizontal_bar': horizontalBar,
  'stats_planet#horizontal_stacked_bar': horizontalStackedBar,
  'stats_planet#line': line,
  'stats_planet#scatterplot': scatterplot,
  'stats_planet#stacked_area': stackedArea,
  'stats_planet#stacked-bar': stackedBar,
};
