const VironLib = require('node-vironlib');

const config = require('./config');
const constant = require('./constant');
const stores = require('./stores');

/**
 * Context
 */
class Context {

  constructor() {
    this.stores = {};
    this.env = process.env.SERVICE_ENV || 'local';
  }

  init() {
    return config.load(this.env)
      .then(conf => {
        return this.initStore(conf.stores);
      })
      .then(() => {
        return this.initVironLib();
      })
      .then(() => {
        return this.initConstant();
      })
    ;
  }

  /**
   * サービス側で定義したconstantとvironlibの定義をマージします
   */
  initConstant() {
    const vironlib = this.getVironLib();
    // サービス側で未定義の定数にvironlibの値をセット
    for (let k in vironlib.constants) {
      if (constant[k] === undefined) {
        constant[k] = vironlib.constants[k];
      }
    }
  }

  /**
   * node-vironlibの初期化を行う
   */
  initVironLib() {
    const store = this.getStoreMain();
    return Promise.resolve()
      .then(() => {
        this.vironlib = new VironLib({
          account: {
            admin_users: store.models.AdminUsers,
          },
          acl: this.getConfigAcl(),
          audit_log: {
            audit_logs: store.models.AuditLogs,
            unless: {
              path: [
                {
                  url: new RegExp('/stats/*'),
                  methods: ['GET'],
                },
                {
                  url: '/ping/deep',
                  methods: ['GET'],
                }
              ],
            },
          },
          admin_user: {
            admin_users: store.models.AdminUsers,
            default_role: this.getDefaultRole(),
          },
          admin_role: {
            admin_roles: store.models.AdminRoles,
            admin_users: store.models.AdminUsers,
            store: store.instance,
            default_role: this.getDefaultRole(),
          },
          auth: {
            admin_users: store.models.AdminUsers,
            admin_roles: store.models.AdminRoles,
            default_role: this.getDefaultRole(),
            super_role: this.getSuperRole(),
            auth_jwt: this.getConfigAuthJwt(),
            google_oauth: this.getConfigGoogleOAuth(),
          },
          autocomplete: {
            store: store.instance,
          },
          pager: {
            limit: constant.DEFAULT_PAGER_LIMIT,
          },
          swagger: {
            host: this.getConfigHost(),
            super_role: this.getSuperRole(),
            store: store.instance,
          },
          body_completion: {
            exclude_paths: [],
          },
        });
        return this.vironlib;
      })
    ;
  }

  /**
   * DataStoreの初期化を行う
   */
  initStore(configStores) {
    const task = (name, configStore) => {
      const type = configStore.type;
      const store = stores[type];

      return store.init(configStore)
        .then(instance => {
          this.stores[name] = {
            type,
            instance,
            functions: store.functions,
            models: store.functions.defineModels && store.functions.defineModels(instance, store.models),
            helper: store.helper,
          };

          console.log(`Connection has been established successfully to the '${name}' store.`, JSON.stringify(store.functions.getOptions(instance)));
        })
      ;
    };

    const tasks = Object.keys(configStores).map(name => {
      return task(name, configStores[name]);
    });

    return Promise.all(tasks);
  }

  /**
   * すべてのストアを取得する
   */
  getStores() {
    return this.stores;
  }

  /**
   * 任意 ストア 取得
   * @param name ストア名
   * @returns {*}
   */
  getStore(name) {
    return this.stores[name];
  }

  /**
   * main ストア 取得
   * @returns {*} sequelize
   */
  getStoreMain() {
    return this.stores.main;
  }

  /**
   * vironlib 取得
   * @returns {*}
   */
  getVironLib() {
    return this.vironlib;
  }

  /**
   * super role id 取得
   */
  getSuperRole() {
    return config.super_role;
  }

  /**
   * default role id 取得
   */
  getDefaultRole() {
    return config.default_role;
  }

  /**
   * config auth_jwt 取得
   */
  getConfigAuthJwt() {
    return config.auth_jwt;
  }

  /**
   * config google_oauth 取得
   */
  getConfigGoogleOAuth() {
    return config.google_oauth;
  }

  /**
   * config ssl 取得
   */
  getConfigSsl() {
    return config.ssl;
  }

  /**
   * config acl 取得
   */
  getConfigAcl() {
    return config.acl;
  }

  /**
   * config host 取得
   */
  getConfigHost() {
    return config.host;
  }

  /**
   * env 取得
   */
  getEnv() {
    return this.env;
  }

}

module.exports = new Context();
