import { filter, find, forEach } from 'mout/array';
import pathToRegexp from 'path-to-regexp';
import createHashHistory from 'history/createHashHistory';
import constants from './constants';

class Router {
  constructor() {
    /**
     * hash history object.
     * @private
     * @type {Object|null}
     */
    this._history = null;

    /**
     * routing definitions.
     * @private
     * @type {Array}
     */
    this._routes = [];

    /**
     * riotx store instance.
     * @type {riotx.Store}
     */
    this._store = null;

    /**
     * function to stop listening for the changes.
     * to stop, just execute this function.
     * @private
     * @type {Function|null}
     */
    this._unlistener = null;

    /**
     * function that will be called on ahead of every routing.
     * @type {Function}
     */
    this._onBefore = () => {
      return Promise.resolve();
    };

    /**
     * function that will be called on behind of every routing.
     * @type {Function}
     */
    this._onAfter = () => {
      return Promise.resolve();
    };
  }

  /**
   * set riotx.store
   * @param {Store} store
   */
  setStore(store) {
    this._store = store;
    return this;
  }

  /**
   * start listening for changes to the current location.
   * @param {Boolean} autoExec to decide whether routing is executed with the current url.
   */
  start(autoExec = true) {
    this._history = createHashHistory();
    this._unlistener = this._history.listen((location, action) => {
      this._change(location, action);
    });

    if (autoExec) {
      this._change(this.getCurrentLocation(), this.getCurrentAction());
    }
  }

  /**
   * stop listening.
   */
  stop() {
    this._unlistener();
    this._unlistener = null;
  }

  /**
   * register a route.
   * @param {String} pattern express-like url pattern.
   * @param {Function} onRoute a function that will be executed when the route changes.
   * @return {Router}
   */
  on(pattern, onChange) {
    const keys = [];
    const regexp = pathToRegexp(pattern, keys);
    this._routes.push({
      pattern,
      regexp,
      keys,
      onChange
    });
    return this;
  }

  /**
   * register a function to hook just before routing.
   * this function is called on every routing.
   * @param {Function} func
   * @return {Router}
   */
  onBefore(func) {
    this._onBefore = func;
    return this;
  }

  /**
   * register a function to hook just after routing.
   * this function is called on every routing.
   * @param {Function} func
   * @return {Router}
   */
  onAfter(func) {
    this._onAfter = func;
    return this;
  }

  /**
   * navigate to target location.
   * @param {String|Object} path e.g.) '/foo' or { pathname, search, hash }
   * @param {Boolean} forceChange
   */
  navigateTo(path, forceChange = false) {
    return Promise
      .resolve()
      .then(() => {
        if (path !== '/') {
          return Promise.resolve();
        }
        const store = this._store;
        return Promise.all([
          store.action(constants.ACTION_CURRENT_REMOVE),
          store.action(constants.ACTION_DMC_REMOVE),
          store.action(constants.ACTION_PAGE_REMOVE),
          store.action(constants.ACTION_COMPONENTS_REMOVE_ALL)
        ]);
      })
      .then(() => {
        if (forceChange && this.getCurrentLocation().pathname === path) {
          this.refresh();
          return;
        }

        if (this.getCurrentLocation().pathname === path) {
          console.warn('same path is passed.');
          return;
        }

        this._history.push(path);
      });
  }

  /**
   * returns current location.
   * @return {String}
   */
  getCurrentLocation() {
    return this._history.location;
  }

  /**
   * returns current action.
   * @return {String}
   */
  getCurrentAction() {
    return this._history.action;
  }

  refresh() {
    this._change(this.getCurrentLocation(), this.getCurrentAction());
  }

  /**
   * hash version of `location.href`.
   * @param {String} pathname
   */
  createHref(pathname) {
    return this._history.createHref({
      pathname
    });
  }

  resolveCurrentPath(pattern) {
    const keys = [];
    const regexp = pathToRegexp(pattern, keys);
    const pathname = this.getCurrentLocation().pathname;
    const params = {};
    try {
      const list = regexp.exec(pathname).slice(1);
      forEach(keys, (v, i) => {
        params[v.name] = list[i];
      });
    } catch(e) {
      throw new Error(`couldn't parse. pattern was "${pattern}" and pathname was "${pathname}"`);
    }

    return params;
  }

  /**
   * fire route enter event.
   * @private
   * @param {Object} location i.e.) history.location
   * @param {String} action i.e.) history.action
   */
  _change(location/*, action */) {
    const route = find(this._routes, route => {
      return !!route.regexp.exec(location.pathname);
    });

    if (!route) {
      return;
    }

    const params = this._parseLocation(location, route);
    const splitedPathname = filter(location.pathname.split('/'), v => {
      return !!v;
    });

    Promise
      .resolve()
      .then(() => this._onBefore(splitedPathname, location.pathname))
      .then(() => route.onChange(...params))
      .then(() => this._onAfter(splitedPathname, location.pathname))
      .catch(err => {
        console.error(err.message || 'couldn\'t route. check the onBefore and onAfter functions.');
      });
  }

  /**
   * parse location object so riot tag instances can use it with ease.
   * @private
   * @param {Object} location
   * @param {Object} route
   * @return {Object}
   */
  _parseLocation(location, route) {
    const params = {};
    const list = route.regexp.exec(location.pathname).slice(1);
    forEach(route.keys, (v, i) => {
      params[v.name] = list[i];
    });

    const queries = {};
    forEach(location.search.slice(1).split('&'), v => {
      if (!v) {
        return;
      }
      const pair = v.split('=');
      queries[pair[0]] = pair[1];
    });

    const hash = location.hash.slice(1);

    return [params, queries, hash];
  }
}

export default new Router();
