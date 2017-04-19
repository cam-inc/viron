import createHashHistory from 'history/createHashHistory';

class Router {
  constructor() {
    /**
     * hash history object.
     * @type {Object|null}
     */
    this.history = createHashHistory({
      getUserConfirmation : (message, callback) => {
        // callback(true) to continue the navigation.
        // callback(false) to abort it.
        // TODO: 共通モーダルを作成・使用すること。
        callback(window.confirm(message));
      }
    });

    /**
     * function to stop listening for the changes.
     * to stop, just execute this function.
     * @type {Function|null}
     */
    this.unlistener = null;

    /**
     * function to unblock the navigation.
     * to unblock, just execute this function.
     * @type {Function|null}
     */
    this.unblocker = null;
  }

  /**
   * start listening for changes to the current location.
   * @param {Boolean} autoExec to decide whether routing is executed with the current url.
   */
  start(autoExec = true) {
    this.unlistener = this.history.listen((location, action) => {
      // `action` will be one of `PUSH`, `REPLACE`, or `POP`.
      this.trigger(location, action);
    });

    if (autoExec) {
      this.trigger(this.getCurrentLocation(), this.getCurrentAction());
    }
  }

  /**
   * TODO: ルーティング登録機能を追加すること。
   */
  register() {
    //
  }

  /**
   * navigate to target location.
   * @param {String|Object} path e.g.) '/foo' or { pathname, search, hash }
   */
  navigateTo(path) {
    this.history.push(path);
  }

  /**
   * replace the current location of the history stack.
   * @param {String} path e.g.) '/foo' or { pathname, search, hash }
   */
  replace(path) {
    this.history.replace(path);
  }

  /**
   * navigate to next location of the history stack.
   */
  goForward() {
    this.history.goForward();
  }

  /**
   * navigate back to previous location of the history stack.
   */
  goBack() {
    this.history.goBack();
  }

  /**
   * block navigating away from the current location.
   * @param {Function} blocker e.g.) (location, action) => { if (validate) { return 'Are you sure to leave the page?'; } }
   */
  block(blocker) {
    if (this.unblocker) {
      console.warn('You can set only one blocker at most. call unblock() to unblock manually.');
      return;
    }

    this.unblocker = this.history.block(blocker);
  }

  /**
   * unblock navigating away from the current location.
   */
  unblock() {
    if (!this.unblocker) {
      return;
    }

    this.unblocker();
    this.unblocker = null;
  }

  /**
   * returns current location.
   * @return {String}
   */
  getCurrentLocation() {
    return this.history.location;
  }

  /**
   * returns current action.
   * @return {String}
   */
  getCurrentAction() {
    return this.history.action;
  }

  /**
   * trigger path change.
   * @param {Object} location i.e.) history.location
   * @param {String} action i.e.) history.action
   */
  trigger(location, action) {
    // TODO: 強制リロード機能を追加すること。ページ間遷移時など。

    // force unblock so users don't have to be worried about when to unblock.
    this.unblock();
  }
}

export default new Router();
