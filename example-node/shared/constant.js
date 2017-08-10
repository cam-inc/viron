const dmclib = require('node-dmclib');

module.exports = {
  COLOR_RED: 'red', // Endpoint Color,
  COLOR_BLUE: 'blud', // Endpoint Color,
  COLOR_GREEN: 'green', // Endpoint Color,

  DMC_STYLE_LIST: dmclib.constants.DMC_STYLE_LIST,
  DMC_STYLE_TABLE: dmclib.constants.DMC_STYLE_TABLE,
  DMC_STYLE_NUMBER: dmclib.constants.DMC_STYLE_NUMBER,
  DMC_STYLE_GRAPH_SCATTERPLOT: dmclib.constants.DMC_STYLE_GRAPH_SCATTERPLOT,
  DMC_STYLE_GRAPH_LINE: dmclib.constants.DMC_STYLE_GRAPH_LINE,
  DMC_STYLE_GRAPH_BAR: dmclib.constants.DMC_STYLE_GRAPH_BAR,
  DMC_STYLE_GRAPH_HORIZONTAL_BAR: dmclib.constants.DMC_STYLE_GRAPH_HORIZONTAL_BAR,
  DMC_STYLE_GRAPH_STACKED_BAR: dmclib.constants.DMC_STYLE_GRAPH_STACKED_BAR,
  DMC_STYLE_GRAPH_HORIZONTAL_STACKED_BAR: dmclib.constants.DMC_STYLE_GRAPH_HORIZONTAL_STACKED_BAR,
  DMC_STYLE_GRAPH_STACKED_AREA: dmclib.constants.DMC_STYLE_GRAPH_STACKED_AREA,
  DMC_SECTION_DASHBOARD: dmclib.constants.DMC_SECTION_DASHBOARD,
  DMC_SECTION_MANAGE: dmclib.constants.DMC_SECTION_MANAGE,
  DMC_JWT_CLAIMS: dmclib.constants.DMC_JWT_CLAIMS,

  GROUP_EMPTY: '', // グループなし
  GROUP_KPI: 'kpi', // KPI
  GROUP_USER: 'user', // ユーザ
  GROUP_BLOG: 'blog', // ブログ
  GROUP_ADMIN: 'admin', // 管理権限
  GROUP_TEST: 'test', // 検証用

  USER_MALE: 'male',
  USER_FEMALE: 'female',
  USER_BLOOD_TYPE_A: 'A',
  USER_BLOOD_TYPE_B: 'B',
  USER_BLOOD_TYPE_O: 'O',
  USER_BLOOD_TYPE_AB: 'AB',

  BLOG_DESIGN_SIMPLE: 'simple',
  BLOG_DESIGN_TILE: 'tile',
  BLOG_DESIGN_2COLUMN: '2column',
  BLOG_DESIGN_3COLUMN: '3column',
};
