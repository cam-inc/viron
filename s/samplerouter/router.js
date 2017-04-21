import { find } from 'mout/array';
import { equals } from 'mout/object';
import ObjectAssign from 'object-assign';
import pathToRegexp from 'path-to-regexp';
import riot from 'riot';
import createHashHistory from 'history/createHashHistory';

class Router {
  constructor() {
    /**
     * hash history object.
     * @private
     * @type {Object|null}
     */
    this._history = createHashHistory({
      getUserConfirmation : (message, callback) => {
        // callback(true) to continue the navigation.
        // callback(false) to abort it.
        // TODO: 共通モーダルを作成・使用すること。
        callback(window.confirm(message));
      }
    });

    /**
     * copy of hash history object.
     * this is used to determine which route should be on leave phase.
     * @type {Object}
     */
    this._historyCopy = {
      location : {},
      action: ''
    };

    /**
     * routing definitions.
     * @private
     * @type {Array}
     */
    this._routes = [];

    /**
     * function to stop listening for the changes.
     * to stop, just execute this function.
     * @private
     * @type {Function|null}
     */
    this._unlistener = null;

    /**
     * function to unblock the navigation.
     * to unblock, just execute this function.
     * @type {Function|null}
     */
    this._unblocker = null;

    // make children act as page.
    riot.mixin({
      init: function () {
        const isPage = (this.parent && this.parent.isRoute);
        if (!isPage) {
          return;
        }
        this.routeInfo = this.parent.routeInfo;
      }
    });
  }

  /**
   * start listening for changes to the current location.
   * @param {Boolean} autoExec to decide whether routing is executed with the current url.
   */
  start(autoExec = true) {
    this._unlistener = this._history.listen((location, action) => {
      // skip if location is same as previous location.
      // goBack(), goForward() and others trigger listen event even if routing block is on.
      if (equals(location, this._historyCopy.location)) {
        return;
      }

      // `action` will be one of `PUSH`, `REPLACE`, or `POP`.
      this._leave(this._historyCopy.location, this._historyCopy.action);
      // force unblock so users don't have to be worried about when to unblock.
      this.unblock();
      this._enter(location, action);
      this._copyHistory(location, action);
    });

    if (autoExec) {
      this._enter(this.getCurrentLocation(), this.getCurrentAction());
      this._copyHistory(this.getCurrentLocation(), this.getCurrentAction());
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
   * @param {Function} onEnter a function that will be executed when the route is about to enter.
   * @param {Function} onLeave a function that will be executed when the route is abount to leave.
   */
  on(pattern, onEnter, onLeave) {
    this._routes.push({
      pattern,
      regexp: pathToRegexp(pattern),
      onEnter,
      onLeave
    });
  }

  /**
   * navigate to target location.
   * @param {String|Object} path e.g.) '/foo' or { pathname, search, hash }
   */
  navigateTo(path) {
    this._history.push(path);
  }

  /**
   * replace the current location of the history stack.
   * @param {String} path e.g.) '/foo' or { pathname, search, hash }
   */
  replace(path) {
    this._history.replace(path);
  }

  /**
   * navigate to next location of the history stack.
   */
  goForward() {
    this._history.goForward();
  }

  /**
   * navigate back to previous location of the history stack.
   */
  goBack() {
    this._history.goBack();
  }

  /**
   * block navigating away from the current location.
   * @param {Function} blocker e.g.) (location, action) => { if (validate) { return 'Are you sure to leave the page?'; } }
   */
  block(blocker) {
    if (this._unblocker) {
      console.warn('You can set only one blocker at most. call unblock() to unblock manually.');
      return;
    }

    this._unblocker = this._history.block(blocker);
  }

  /**
   * unblock navigating away from the current location.
   */
  unblock() {
    if (!this._unblocker) {
      return;
    }

    this._unblocker();
    this._unblocker = null;
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

  /**
   * fire route enter event.
   * @private
   * @param {Object} location i.e.) history.location
   * @param {String} action i.e.) history.action
   */
  _enter(location, action) {
    const route = find(this._routes, route => {
      return !!route.regexp.exec(location.pathname);
    });

    if (!route) {
      return;
    }

    route.onEnter(this._parseLocation(location, route));
  }

  /**
   * fire route leave event.
   * @private
   * @param {Object} location i.e.) history.location
   * @param {String} action i.e.) history.action
   */
  _leave(location, action) {
    const route = find(this._routes, route => {
      return !!route.regexp.exec(location.pathname);
    });

    if (!route) {
      return;
    }

    route.onLeave(this._parseLocation(location, route));
  }

  /**
   * copy history info.
   * @private
   * @param {Object} location i.e.) history.location
   * @param {String} action i.e.) history.action
   */
  _copyHistory(location, action) {
    this._historyCopy.location = ObjectAssign({}, location);
    this._historyCopy.action = action;
  }

  /**
   * parse location object so riot tag instances can use it with ease.
   * @private
   * @param {Object} location
   * @param {Object} route
   * @return {Object}
   */
  _parseLocation(location, route) {
    return {
      pathname: location.pathname,
      hash: location.hash,
      search: location.search,
      params: route.regexp.exec(location.pathname).slice(1)
    };
  }
}

export default new Router();
