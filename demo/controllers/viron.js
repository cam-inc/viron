const compact = require('mout/array/compact');
const isEmpty = require('mout/lang/isEmpty');
const forOwn = require('mout/object/forOwn');
const some = require('mout/array/some');

const shared = require('../shared');
const context = shared.context;
const constant = shared.constant;

const genComponent = (name, method, path, style, autoRefreshSec, pagination, options) => {
  const cmp = {
    name,
    api: {
      path,
      method,
    },
    style,
    pagination: !!pagination,
    options: options || [{
      key: 'key',
      value: 'value',
    }],
  };

  if (autoRefreshSec) {
    cmp.auto_refresh_sec = autoRefreshSec;
  }

  return cmp;
};

const genTableComponent = (name, method, path, primary, query, labels, actions) => {
  const component = genComponent(name, method, path, constant.VIRON_STYLE_TABLE, null, true);
  if (primary) {
    component.primary = primary;
  }
  if (query) {
    component.query = query;
  }
  if (labels) {
    component.table_labels = labels;
  }
  if (actions) {
    component.actions = actions;
  }
  return component;
};

const genPage = (section, group, id, name, components) => {
  return {
    id,
    name,
    section,
    components,
    group,
  };
};

const genGroup = (section, pages, groupName) => {
  const list = pages.map(page => {
    return genPage(section, groupName, page.id, page.name, page.components);
  });
  return list;
};

const genSection = (section, groups) => {
  let list = [];
  forOwn(groups, (pages, groupName) => {
    list = list.concat(genGroup(section, pages, groupName));
  });
  return list;
};

/**
 * GET: /viron
 */
const show = (req, res) => {
  const vironlib = context.getVironLib();
  const env = context.getEnv();
  const helperAdminRole = vironlib.adminRole.helper;
  const title = req.swagger.swaggerObject.info.title;

  const result = {
    name: `${title} - ${env}`,
    color: 'white',
    theme: 'standard',
    thumbnail: 'https://cam-inc.github.io/viron/latest/img/favicon-32x32.png', // サービスのアイコン等を指定
    tags: [env, 'viron', 'demo'],
    pages: [].concat(
      // QuickView
      genSection(constant.VIRON_SECTION_DASHBOARD, {
        [constant.GROUP_EMPTY]: [
          {
            id: 'quickview',
            name: 'クイックビュー',
            components: [
              genComponent('DAU', 'get', '/stats/dau', constant.VIRON_STYLE_NUMBER, 5),
              genComponent('MAU', 'get', '/stats/mau', constant.VIRON_STYLE_NUMBER, 30),
              genComponent('Chart(bar)', 'get', '/stats/chart/bar', constant.VIRON_STYLE_GRAPH_BAR),
              genComponent('Chart(scatterplot)', 'get', '/stats/chart/scatterplot', constant.VIRON_STYLE_GRAPH_SCATTERPLOT),
              genComponent('Chart(line)', 'get', '/stats/chart/line', constant.VIRON_STYLE_GRAPH_LINE),
              genComponent('Chart(horizontal-bar)', 'get', '/stats/chart/horizontal-bar', constant.VIRON_STYLE_GRAPH_HORIZONTAL_BAR),
              genComponent('Chart(stacked-bar)', 'get', '/stats/chart/stacked-bar', constant.VIRON_STYLE_GRAPH_STACKED_BAR),
              genComponent('Chart(horizontal-stacked-bar)', 'get', '/stats/chart/horizontal-stacked-bar', constant.VIRON_STYLE_GRAPH_HORIZONTAL_STACKED_BAR),
              genComponent('Chart(stacked-area)', 'get', '/stats/chart/stacked-area', constant.VIRON_STYLE_GRAPH_STACKED_AREA),
            ],
          }
        ],
      }),
      genSection(constant.VIRON_SECTION_MANAGE, {
        // Manage
        [constant.GROUP_USER]: [
          {
            id: 'user',
            name: 'ユーザ',
            components: [
              genTableComponent('ユーザ', 'get', '/user', 'id', [
                {key: 'name', type: 'string'}
              ], ['id', 'name', 'job', 'sex'], [
                '/user/upload/csv',
                '/user/download/csv',
              ]),
            ],
          },
          {
            id: 'userblog',
            name: 'ユーザブログ',
            components: [
              genTableComponent('ユーザブログ', 'get', '/userblog', 'id', [
                {key: 'user_id', type: 'integer'},
                {key: 'genre', type: 'string'},
                {key: 'title', type: 'string'},
              ], ['id', 'user_id', 'genre', 'title', 'sub_title']),
            ],
          },
          {
            id: 'userblogentry',
            name: 'ユーザブログ記事',
            components: [
              genTableComponent('ユーザブログ記事', 'get', '/userblogentry', 'id', [
                {key: 'user_blog_id', type: 'integer'},
                {key: 'title', type: 'string'},
                {key: 'theme', type: 'string'},
              ], ['id', 'user_blog_id', 'title', 'theme']),
            ],
          },
          {
            id: 'userfavorite',
            name: 'お気に入り',
            components: [
              genTableComponent('お気に入り', 'get', '/userfavorite', 'user_id', null, ['id', 'user_id']),
            ],
          },
        ],
        [constant.GROUP_BLOG]: [
          {
            id: 'blogdesign',
            name: 'ブログデザイン',
            components: [
              genTableComponent('ブログデザイン', 'get', '/blogdesign', 'id', [
                {key: 'id', type: 'string'},
                {key: 'name', type: 'string'},
              ], ['id', 'name']),
            ],
          },
        ],
        [constant.GROUP_EXAMPLE]: [
          {
            id: 'validator',
            name: 'バリデータ',
            components: [
              genTableComponent('バリデータ', 'get', '/validator', 'id', null, ['validation_type']),
            ],
          },
          {
            id: 'nestedarray',
            name: 'ネスト配列',
            components: [
              genTableComponent('ネスト配列', 'get', '/nestedarray', 'id', null, ['id']),
            ],
          },
          {
            id: 'format',
            name: 'フォーマット',
            components: [
              genTableComponent('フォーマット', 'get', '/format', 'id', null, ['id']),
            ],
          },
          {
            id: 'multiquery',
            name: '横断検索',
            components: [
              genTableComponent('A', 'get', '/multiquery/a', null, [
                {key: 'id', type: 'string'},
                {key: 'name', type: 'string'},
              ], ['id', 'name']),
              genTableComponent('B', 'get', '/multiquery/b', null, [
                {key: 'id', type: 'string'},
                {key: 'name', type: 'string'},
                {key: 'age', type: 'integer'},
              ], ['id', 'name', 'age']),
              genTableComponent('C', 'get', '/multiquery/c', null, [
                {key: 'id', type: 'string'},
                {key: 'age', type: 'integer'},
              ], ['id', 'age']),
              genTableComponent('D', 'get', '/multiquery/d', null, [
                {key: 'id', type: 'string'},
                {key: 'address', type: 'string'},
              ], ['id', 'address']),
              genTableComponent('E', 'get', '/multiquery/e', null, [
                {key: 'id', type: 'string'},
                {key: 'job', type: 'string'},
                {key: 'name', type: 'string'},
              ], ['id', 'job', 'name']),
            ],
          },
          {
            id: 'formdata',
            name: 'フォームデータ',
            components: [
              genTableComponent('string', 'get', '/formdata/string', null, null, ['?']),
              genTableComponent('number', 'get', '/formdata/number', null, null, ['?']),
              genTableComponent('boolean', 'get', '/formdata/boolean', null, null, ['?']),
            ],
          },
          {
            id: 'defaultform',
            name: 'デフォルト',
            components: [
              genTableComponent('デフォルト', 'get', '/default', 'id', null, ['id']),
            ],
          },
        ],
        // Admin
        [constant.GROUP_ADMIN]: [
          {
            id: 'adminrole',
            name: 'Viron ユーザ権限',
            components: [
              genTableComponent('Viron ユーザ権限', 'get', '/adminrole', 'role_id', null, ['role_id']),
            ],
          },
          {
            id: 'adminuser',
            name: 'Viron 管理ユーザ',
            components: [
              genTableComponent('Viron 管理ユーザ', 'get', '/adminuser', 'id', null, ['id', 'email', 'role_id']),
            ],
          },
          {
            id: 'auditlog',
            name: 'Viron 監査ログ',
            components: [
              genTableComponent('Viron 監査ログ', 'get', '/auditlog', null, [
                {key: 'createdAt', type: 'string'},
                {key: 'request_uri', type: 'string'},
                {key: 'request_method', type: 'string'},
                {key: 'source_ip', type: 'string'},
                {key: 'status_code', type: 'integer'},
                {key: 'user_id', type: 'string'},
              ], ['createdAt', 'request_uri', 'request_method', 'status_code', 'user_id']),
            ],
          },
          {
            id: 'account',
            name: 'アカウント設定',
            components: [
              genTableComponent('アカウント設定', 'get', '/account', 'id', null, ['id', 'email', 'role_id']),
            ],
          },
        ],
      })
    ),
  };

  if (!req.swagger.operation.security) {
    // /viron自体が非認証の場合はそのまま返す
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
      } else if (component.actions) {
        // actionsはGET,POST,PUT,DELETEすべてに権限がないものは削除
        page.components[j].actions = component.actions.filter(action => {
          return some(Object.keys(req.swagger.swaggerObject.paths[action]), method => {
            return helperAdminRole.canAccess(action, method, roles);
          });
        });
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
  'viron#show': show,
};
