import clipboard from 'clipboard-js';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import isNull from 'mout/lang/isNull';
import isUndefined from 'mout/lang/isUndefined';
import ObjectAssign from 'object-assign';

export default function() {
  const store = this.riotx.get();

  // クリップボードコピーをサポートしているか否か。
  let isClipboardCopySupported = true;
  // モバイル用レイアウトか否か。
  this.isMobile = store.getter('layout.isMobile');

  const getNewOptions = () => {
    const selectedIndex = this.refs.select.selectedIndex;
    const newOptions = [];
    forEach(this.opts.options, (option, idx) => {
      newOptions.push(ObjectAssign({}, option, {
        isSelected: (idx === selectedIndex)
      }));
    });
    return newOptions;
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onchange(getNewOptions());
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleSelectInput = () => {
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onchange(getNewOptions());
  };

  this.handleSelectChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
    if (this.isMobile || !isClipboardCopySupported) {
      return;
    }
    const target = find(this.opts.options || [], { isSelected: true });
    const val = target && target.value;
    if (isUndefined(val) || isNull(val)) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(String(val));
      })
      .then(() => store.action('toasts.add', {
        message: 'クリップボードへコピーしました。'
      }))
      .catch(() => {
        isClipboardCopySupported = false;
        store.action('toasts.add', {
          type: 'error',
          message: 'ご使用中のブラウザではクリップボードへコピー出来ませんでした。'
        });
      });
  };
}
