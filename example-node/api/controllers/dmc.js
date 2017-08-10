const compact = require('mout/array/compact');
const isEmpty = require('mout/lang/isEmpty');
const dmclib = require('node-dmclib');

const constant = require('../../shared/constant');
const helperAdminRole = dmclib.adminRole.helper;

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
        section: constant.DMC_SECTION_DASHBOARD,
        group: constant.GROUP_EMPTY,
        components: [
          {
            name: 'DAU',
            api: api('/stats/dau', 'get'),
            style: constant.DMC_STYLE_NUMBER,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'MAU',
            api: api('/stats/mau', 'get'),
            style: constant.DMC_STYLE_NUMBER,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(bar)',
            api: api('/stats/planet/bar', 'get'),
            style: constant.DMC_STYLE_GRAPH_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(scatterplot)',
            api: api('/stats/planet/scatterplot', 'get'),
            style: constant.DMC_STYLE_GRAPH_SCATTERPLOT,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(line)',
            api: api('/stats/planet/line', 'get'),
            style: constant.DMC_STYLE_GRAPH_LINE,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(horizontal-bar)',
            api: api('/stats/planet/horizontal-bar', 'get'),
            style: constant.DMC_STYLE_GRAPH_HORIZONTAL_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(stacked-bar)',
            api: api('/stats/planet/stacked-bar', 'get'),
            style: constant.DMC_STYLE_GRAPH_STACKED_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(horizontal-stacked-bar)',
            api: api('/stats/planet/horizontal-stacked-bar', 'get'),
            style: constant.DMC_STYLE_GRAPH_HORIZONTAL_STACKED_BAR,
            options: [defaultOptions],
            pagination: false,
          },
          {
            name: 'Planet(stacked-area)',
            api: api('/stats/planet/stacked-area', 'get'),
            style: constant.DMC_STYLE_GRAPH_STACKED_AREA,
            options: [defaultOptions],
            pagination: false,
          },
        ],
      },
      // Manage
      {
        id: 'user',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザ',
        components: [
          {
            name: 'ユーザ',
            api: api('/user', 'get'),
            style: constant.DMC_STYLE_TABLE,
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
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザブログ',
        components: [
          {
            name: 'ユーザブログ',
            api: api('/userblog', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'user_id'],
          },
        ],
      },
      {
        id: 'userblogentry',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_USER,
        name: 'ユーザブログ記事',
        components: [
          {
            name: 'ユーザブログ',
            api: api('/userblogentry', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'user_blog_id'],
          },
        ],
      },
      {
        id: 'validator',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_TEST,
        name: 'バリデータ検証',
        components: [
          {
            name: 'バリデータ',
            api: api('/validator', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['validation_type'],
          },
        ],
      },
      {
        id: 'nestedarray',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_TEST,
        name: 'ネスト配列',
        components: [
          {
            name: 'ネスト配列',
            api: api('/nestedarray', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id'],
          },
        ],
      },
      {
        id: 'blogdesign',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_BLOG,
        name: 'ブログ デザイン',
        components: [
          {
            name: 'ブログ デザイン',
            api: api('/blogdesign', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['id', 'name'],
          },
        ],
      },
      // Admin
      {
        id: 'adminrole',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC ユーザ権限',
        components: [
          {
            name: 'DMC ユーザ権限',
            api: api('/adminrole', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: false,
            table_labels: ['role_id'],
          },
        ],
      },
      {
        id: 'adminuser',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC 管理ユーザ',
        components: [
          {
            name: 'DMC 管理ユーザ',
            api: api('/adminuser', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['email', 'role_id'],
          },
        ],
      },
      {
        id: 'auditlog',
        section: constant.DMC_SECTION_MANAGE,
        group: constant.GROUP_ADMIN,
        name: 'DMC 監査ログ',
        components: [
          {
            name: 'DMC 監査ログ',
            api: api('/auditlog', 'get'),
            style: constant.DMC_STYLE_TABLE,
            options: [defaultOptions],
            pagination: true,
            table_labels: ['createdAt', 'request_uri', 'request_method'],
          },
        ],
      },
    ],
  };

  if (!req.swagger.operation.security) {
    // /dmc自体が非認証の場合はそのまま返す
    return res.json(result);
  }

  // 権限がないcomponentを消してから返す
  const roles = req.auth.roles;
  for (let i in result.pages) {
    const page = result.pages[i];
    for (let j in page.components) {
      const component = page.components[j];
      const method = component.api.method;
      const path = component.api.path;
      if (!helperAdminRole.canAccess(path, method, roles)) {
        // 権限がないcomponentを削除
        page.components[j] = null;
      }
    }
    page.components = compact(page.components);
    if (isEmpty(page.components)) {
      // componentが空になった場合はpage自体を削除
      result.pages[i] = null;
    }
  }
  result.pages = compact(result.pages);

  res.json(result);
};

module.exports = {
  'dmc#show': show,
};
