import riot from 'riot';
import i18n from './i18n';
import router from './router';

// 指(or pointer)のstartからendまでの座標移動距離。tapと見なすかの閾値となります。
const TAP_ALLOW_RANGE = 10;
// 指(or pointer)が押されている時にDOM要素に付与されるclass属性値。
const TAP_HOLD_CLASSNAME = 'hold';

export default {
  /**
   * riotのmixinを設定します。
   * @return {Promise}
   */
  init: () => {
    return Promise
      .resolve()
      .then(() => {
        riot.settings.autoUpdate = false;
        riot.mixin({
          init: function() {
            // 各riotタグインスタンスから簡単にi18n機能を使用可能にする。
            this.i18n = i18n.get();
          },
          // riotx.riotxChange(store, evtName, func)のショートカット。
          listen: function(...args) {
            const store = this.riotx.get();
            this.riotxChange(store, ...args);
          },
          // pugファイルとjsファイルを分離して実装可能にするため。
          external: function(script) {
            const tag = this;
            script.apply(tag);
          },
          // `modal`等と意識せずにcloseできるようにする。
          close: function() {
            if (this.opts.isModal) {
              this.opts.modalCloser();
            }
            if (this.opts.isMediapreview) {
              this.opts.mediapreviewCloser();
            }
            if (this.opts.isDrawer) {
              this.opts.drawerCloser();
            }
            if (this.opts.isPopover) {
              this.opts.popoverCloser();
            }
          },
          // `modal`等を全て消します。
          closeAllFloats: function() {
            const store = this.riotx.get();
            store.action('popovers.removeAll');
          },
          getRouter: () => {
            return router.getInstance();
          },
          getClickHandler: function(handlerName) {
            // `parent.parent.handleFoo`な形式への対応。
            let context = this;
            while (handlerName.indexOf('parent.') === 0) {
              handlerName = handlerName.replace('parent.', '');
              context = context.parent;
            }
            return e => {
              // Do nothing if touchstart has already been fired.
              if (!!e.currentTarget.getAttribute('touch_mode')) {
                e.currentTarget.removeAttribute('touch_mode');
                this._isTouchMode = false;
                return;
              }
              context[handlerName](e);
            };
          },
          getTouchStartHandler: function() {
            return e => {
              e.currentTarget.setAttribute('touch_mode', 'true');
              const initX = e.touches[0].pageX;
              const initY = e.touches[0].pageY;
              e.currentTarget.setAttribute('touch_start_x', initX);
              e.currentTarget.setAttribute('touch_start_y', initY);
              e.currentTarget.classList.add(TAP_HOLD_CLASSNAME);
            };
          },
          getTouchMoveHandler: function() {
            return e => {
              const isPressed = e.currentTarget.classList.contains(TAP_HOLD_CLASSNAME);
              if (!isPressed) {
                return;
              }
              const initX = e.currentTarget.getAttribute('touch_start_x');
              const initY = e.currentTarget.getAttribute('touch_start_y');
              const curX = e.touches[0].pageX;
              const curY = e.touches[0].pageY;
              const distanceX = curX - initX;
              const distanceY = curY - initY;
              const hypotenuse = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
              if (hypotenuse >= TAP_ALLOW_RANGE) {
                e.currentTarget.classList.remove(TAP_HOLD_CLASSNAME);
              }
            };
          },
          getTouchEndHandler: function(handlerName) {
            // `parent.parent.handleFoo`な形式への対応。
            let context = this;
            while (handlerName.indexOf('parent.') === 0) {
              handlerName = handlerName.replace('parent.', '');
              context = context.parent;
            }
            const handler = context[handlerName];
            return e => {
              const isPressed = e.currentTarget.classList.contains(TAP_HOLD_CLASSNAME);
              if (isPressed) {
                handler(e);
              }
              e.currentTarget.classList.remove(TAP_HOLD_CLASSNAME);
            };
          }
        });
      });
  }
};
