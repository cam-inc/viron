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
    name: title,
    color: 'black',
    theme: 'standard',
    thumbnail: 'https://cam-inc.github.io/viron/latest/img/favicon-32x32.png', // サービスのアイコン等を指定
    tags: [env, 'viron', 'example-email'],
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
              genComponent('Chart(area)', 'get', '/stats/area', constant.VIRON_STYLE_GRAPH_STACKED_AREA),
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
              genTableComponent('ユーザ', 'get', '/user', 'id', null, ['id', 'name']),
            ]
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
