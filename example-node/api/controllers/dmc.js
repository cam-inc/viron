const constant = require('../../shared/constant');

const defaultOptions = {
  key: 'key',
  value: 'value',
};

const api = (path, method) => {
  return {path, method};
};

/**
 * GET: /dmc
 */
const show = (req, res) => {
  const result = {
    name: 'DMC Example Project for Node.js',
    color: 'white',
    thumbnail: 'https://avatars3.githubusercontent.com/u/23251378?v=3&s=200',
    tags: ['develop', 'dmc', 'example'],
    pages: [
      // QuickView
      {
        id: 'quickview',
        name: 'クイックビュー',
        section: constant.SECTION_DASHBOARD,
        group: constant.GROUP_EMPTY,
        components: [
          {
            name: 'DAU',
            api: api('/stats/dau', 'get'),
            style: constant.STYLE_NUMBER,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'MAU',
            api: api('/stats/mau', 'get'),
            style: constant.STYLE_NUMBER,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(bar)',
            api: api('/stats/planet/bar', 'get'),
            style: constant.STYLE_GRAPH_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(scatterplot)',
            api: api('/stats/planet/scatterplot', 'get'),
            style: constant.STYLE_GRAPH_SCATTERPLOT,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(line)',
            api: api('/stats/planet/line', 'get'),
            style: constant.STYLE_GRAPH_LINE,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(horizontal-bar)',
            api: api('/stats/planet/horizontal-bar', 'get'),
            style: constant.STYLE_GRAPH_HORIZONTAL_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(stacked-bar)',
            api: api('/stats/planet/stacked-bar', 'get'),
            style: constant.STYLE_GRAPH_STACKED_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(horizontal-stacked-bar)',
            api: api('/stats/planet/horizontal-stacked-bar', 'get'),
            style: constant.STYLE_GRAPH_HORIZONTAL_STACKED_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(stacked-area)',
            api: api('/stats/planet/stacked-area', 'get'),
            style: constant.STYLE_GRAPH_STACKED_AREA,
            options: [defaultOptions],
            pagination: false,
          },
        ],
      },
      // Manage
      {
        id: 'user',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザ',
        components: [
          {
            name: 'ユーザ',
            api: api('/user', 'get'),
            style: constant.STYLE_TABLE,
            query: [
              {
                key: 'name',
                type: 'string',
              },
            ],
            options: [defaultOptions],
            pagination: false,
            table_labels: ['id', 'name'],
          },
        ],
      },
      {
        id: 'userblog',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザブログ',
        components: [
          {
            name: 'ユーザブログ',
            api: api('/userblog', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'user_id'],
          },
        ],
      },
      {
        id: 'userblogentry',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザブログ記事',
        components: [
          {
            name: 'ユーザブログ',
            api: api('/userblogentry', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'user_blog_id'],
          },
        ],
      },
      {
        id: 'blogdesign',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_BLOG,
        name: 'ブログ デザイン',
        components: [
          {
            name: 'ブログ デザイン',
            api: api('/blogdesign', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'name'],
          },
        ],
      },
      // Admin
      {
        id: 'adminrole',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC ユーザ権限',
        components: [
          {
            name: 'DMC ユーザ権限',
            api: api('/adminrole', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: false,
            table_labels: ['role_id'],
          },
        ],
      },
      {
        id: 'adminuser',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC 管理ユーザ',
        components: [
          {
            name: 'DMC 管理ユーザ',
            api: api('/adminuser', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: false,
            table_labels: ['email', 'role_id'],
          },
        ],
      },
      {
        id: 'auditlog',
        section: constant.SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC 監査ログ',
        components: [
          {
            name: 'DMC 監査ログ',
            api: api('/auditlog', 'get'),
            style: constant.STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['created_at', 'request_uri', 'request_method'],
          },
        ],
      },
    ],
  };

  // TODO: filter by admin role

  res.json(result);
};

module.exports = {
  'dmc#show': show,
};
