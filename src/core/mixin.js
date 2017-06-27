import forEach from 'mout/array/forEach';
import riot from 'riot';
import router from './router';

/**
 * touch系イベントが定義されたdom要素群を返却します。
 * @param {Riot} tag
 * @return {Array}
 */
const getTouchableElements = tag => {
  const refs = tag.refs;
  let elms = [];
  if (Array.isArray(refs.touch)) {
    elms = refs.touch;
  } else if (!!refs.touch) {
    elms = [refs.touch];
  }
  return elms;
};

/**
 * Touch系操作に対応する。
 * @param {Riot} tag
 */
const isSupportTouch = 'ontouchstart' in document;
const EVENT_TOUCHSTART = isSupportTouch ? 'touchstart' : 'mousedown';
const EVENT_TOUCHMOVE = isSupportTouch ? 'touchmove' : 'mousemove';
const EVENT_TOUCHEND = isSupportTouch ? 'touchend' : 'mouseup';
// 無名関数をaddEventListenerのハンドラーに設定した場合でも正しくremoveEventListener出来るようにする。
const closureEventListener = (() => {
  const events = {};
  let key = 0;
  return {
    add: (target, type, listener, capture) => {
      target.addEventListener(type, listener, capture);
      const eventId = `t_${key}`;
      key++;
      events[eventId] = {
        target: target,
        type: type,
        listener: listener,
        capture: capture
      };
      return eventId;
    },
    remove: key => {
      if (!events[key]) {
        return;
      }
      events[key].target.removeEventListener(events[key].type, events[key].listener, events[key].capture);
      delete events[key];
    },
    list: () => {
      return events;
    }
  };
})();
const bindTouchEvents = tag => {
  forEach(getTouchableElements(tag), elm => {
    const touchStartEventId = closureEventListener.add(elm, EVENT_TOUCHSTART, e => {
      e.stopPropagation();
      e.currentTarget.classList.add('hover');
    });

    const touchMoveEventId = closureEventListener.add(elm, EVENT_TOUCHMOVE, e => {
      e.stopPropagation();
      const isPressed = e.currentTarget.classList.contains('hover');
      if (!isPressed) {
        return;
      }
      e.currentTarget.classList.remove('hover');
    });

    const touchEndEventId = closureEventListener.add(elm, EVENT_TOUCHEND, e => {
      e.stopPropagation();
      // TODO: 2回発火しているかも。。
      const isPressed = e.currentTarget.classList.contains('hover');
      if (isPressed) {
        // ハンドラーを取得。無ければ何もしない。
        const handlerName = elm.getAttribute('ontap');
        if (!!handlerName && !!tag[handlerName]) {
          tag[handlerName](e);
        }
      }
      e.currentTarget.classList.remove('hover');
    });

    elm.setAttribute('touchevents', `${touchStartEventId}/${touchMoveEventId}/${touchEndEventId}`);
  });
};
const unbindTouchEvents = tag => {
  forEach(getTouchableElements(tag), elm => {
    const touchEvents = elm.getAttribute('touchevents');
    if (!touchEvents) {
      return;
    }
    const touchEventIds = touchEvents.split('/');
    forEach(touchEventIds, touchEventId => {
      closureEventListener.remove(touchEventId);
    });
  });
};

export default {
  /**
   * riotのmixinを設定します。
   * @return {Promise}
   */
  init: () => {
    return Promise
      .resolve()
      .then(() => {
        riot.mixin({
          init: function() {
            this.on('mount', () => {
              bindTouchEvents(this);
            }).on('before-unmount', () => {
              unbindTouchEvents(this);
            });
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
          },
          getRouter: () => {
            return router.getInstance();
          }
        });
      });
  }
};
