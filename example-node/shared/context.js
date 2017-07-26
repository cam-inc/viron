
const config = require('./config');
const stores = require('./stores');

/**
 * Context
 */
class Context {

  constructor() {
    this.stores = {};
  }

  init() {
    return config.load()
      .then(conf => {
        return this.initStore(conf.stores);
      })
    ;
  }

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
          };
          // TODO: logger
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
   * config cors 取得
   */
  getConfigCors() {
    return config.cors;
  }

}

module.exports = new Context();
