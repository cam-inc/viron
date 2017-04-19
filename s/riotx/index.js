'use strict';

import riot from 'riot'


/**
 * log output
 */
let log = function() {
  if (!settings.debug) {
    return;
  }

  let args = Array.prototype.slice.call(arguments);
  args.unshift('[riotx]');
  //args.push(new Error('stack')); // stack trace
  try {
    console.log.apply(console, args); // eslint-disable-line
  } catch (e) {
    console.log(args); // eslint-disable-line
  }
};

/**
 * settings for riotx
 * @type {{debug: boolean, default: string}}
 */
let settings = {
  debug: true,
  default: '@'
};

class Store {

  /**
   * @param { name: 'Store Name', state: { default state data }, actions: { TODO } mutations: { TODO }, getters: { TODO } }
   */
  constructor(_store) {

    this.name = _store.name;
    if (!this.name) {
      this.name = settings.default;
      log('Default store name. name=' + this.name);
    }

    this.state = _store.state ? Object.assign({}, _store.state) : {};
    this.actions = _store.actions ? _store.actions : {};
    this.mutations = _store.mutations ? _store.mutations : {};
    this.getters = _store.getters ? _store.getters : {};

    riot.observable(this);

  }

  /**
   * Getter state
   */
  getter() {
    let _state = Object.assign({}, this.state);
    let args = [].slice.call(arguments);
    let name = args.shift();
    args.unshift(_state);
    log('[getter]', name, args);
    return this.getters[name].apply(this, args);
  }

  /**
   * Commit mutation
   * @param name mutation name
   * @param obj commit data object
   */
  commit(name, obj) {
    let _state = Object.assign({}, this.state);
    log('[commit]', name, _state, obj);
    this.mutations[name].apply(this, [_state, obj]);
    Object.assign(this.state, _state); // commit!!!
  }

  /**
   * emit action
   * @param [0] action name
   * @param [1...] parameter's to action
   */
  action() {
    return new Promise((resolve, reject) => {
      let args = [].slice.call(arguments);
      let name = args.shift();
      // args.push(Object.assign({}, this.state));

      args.push((err/*, _state*/) => {
        // TODO err
        if (err) {
          return reject(err);
        }

        // let res = Object.assign(this.state, _state);
        log('[trigger]', name, this.state);
        // return emit view component's
        this.trigger(name, null, this.state, this)
        resolve(this.state);
      });

      // emit action
      log('[action]', name, args);
      this.actions[name].apply(this, args);
    });
  }

}

class RiotX {

  constructor() {
    this.settings = settings;
    this.Store = Store;
    this.stores = {};

    let self = this;
    riot.mixin({
      init: function () {
        let self = this;
        this.on('unmount', function () {
          self.off('*');
        });

        if (self.debug) {
          // curious about all events ?
          this.on('*', function (eventName) {
            console.log('events.*', eventName)
          })
        }
      },
      riotx: self,
    });
  }


  /**
   * Add store instance
   * @param store RiotX.Store instance
   * @returns {RiotX}
   */
  add(store) {
    if (this.stores[store.name]) {
      let err = new Error('The store has been overwritten. name=' + store.name);
      throw err;
    }

    this.stores[store.name] = store;
    return this;
  }

  /**
   * Get store instance
   * @param name store name
   * @returns {RiotX.Store} store instance
   */
  get(name) {
    name = name ? name : settings.default;
    return this.stores[name];
  }

}

export default new RiotX();
