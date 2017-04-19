import ObjectAssign from 'object-assign';
import riot from 'riot';

/**
 * settings for riotx
 * @type {{debug: boolean, default: string}}
 */
const settings = {
  debug: true,
  default: '@'
};

/**
 * log output
 */
const log = (...args) => {
  if (!settings.debug) {
    return;
  }

  args.unshift('[riotx]');
  //args.push(new Error('stack')); // stack trace
  try {
    console.log.apply(console, args); // eslint-disable-line
  } catch (e) {
    console.log(args); // eslint-disable-line
  }
};


class Store {
  /**
   * @param { name: 'Store Name', state: { default state data }, actions: { TODO } mutations: { TODO }, getters: { TODO } }
   */
  constructor(_store) {
    /**
     * name of the store.
     * @type {String}
     */
    this.name = _store.name;
    if (!this.name) {
      this.name = settings.default;
      log(`Default store name. name=${this.name}`);
    }

    /**
     * a object that represents full application state.
     * @type {Object}
     */
    this.state = ObjectAssign({}, _store.state);

    /**
     * functions to mutate application state.
     * @type {Object}
     */
    this._actions = ObjectAssign({}, _store.actions);

    /**
     * mutaions.
     * mutaion = a function which mutates the state.
     * all mutation functions take two parameters which are `state` and `obj`.
     * `state` will be TODO.
     * `obj` will be TODO.
     * @type {Object}
     */
    this._mutations = ObjectAssign({}, _store.mutations);

    /**
     * TODO
     * @type {Object}
     */
    this._getters = ObjectAssign({}, _store.getters);

    riot.observable(this);
  }

  /**
   * Getter state
   * @param {String} name TODO
   * @param {...*} args
   */
  getter(name, ...args) {
    const _state = ObjectAssign({}, this.state);
    args.unshift(_state);
    log('[getter]', name, args);
    return this._getters[name].apply(this, args);
  }

  /**
   * Commit mutation.
   * only actions are allowed to execute this function.
   * @param {String} name mutation name
   * @param {Object} obj commit data object
   */
  commit(name, obj) {
    const newState = ObjectAssign({}, this.state);
    log('[commit(before)]', name, newState, obj);
    this._mutations[name](newState, obj);
    log('[commit(after)]', name, newState, obj);
    ObjectAssign(this.state, newState);
    this.trigger(name, null, this.state, this);
  }

  /**
   * emit action.
   * only ui components are allowed to execute this function.
   * @param {Stting} name action name
   * @param {...*} args parameter's to action
   * @return {Promise}
   */
  action(name, ...args) {
    log('[action]', name, args);

    return Promise
      .resolve()
      .then(() => this._actions[name]((...args) => {
        this.commit(...args);
      }, ...args));
      //.then(() => this._actions[name].apply(this, args));
  }
}

class RiotX {
  constructor() {
    /**
     * constructor of RiotX.Store.
     * @type {Class}
     */
    this.Store = Store;

    /**
     * instances of RiotX.Store.
     * @type {Object}
     */
    this.stores = {};

    // register a mixin globally.
    riot.mixin({
      // intendedly use `function`.
      // switch the context of `this` from `riotx` to `riot tag instance`.
      init: function () {
        // the context of `this` will be equal to riot tag instant.
        this.on('unmount', () => {
          this.off('*');
        });

        if (settings.debug) {
          this.on('*', eventName => {
            log(eventName, this);
          });
        }
      },
      // give each riot instance the ability to access the globally defined singleton RiotX instance.
      riotx: this
    });
  }


  /**
   * Add a store instance
   * @param {RiotX.Store} store instance of RiotX.Store
   * @returns {RiotX}
   */
  add(store) {
    if (this.stores[store.name]) {
      throw new Error(`The store instance named \`${store.name}\` already exists.`);
    }

    this.stores[store.name] = store;
    return this;
  }

  /**
   * Get store instance
   * @param {String} name store name
   * @returns {RiotX.Store} store instance
   */
  get(name = settings.default) {
    return this.stores[name];
  }
}

export default new RiotX();
