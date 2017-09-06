import contains from 'mout/array/contains';
import { constants as actions } from '../../../store/actions';
import '../../atoms/dmc-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleTap = () => {
    // クリップボードにコピーできないタイプであればスルーする。
    const type = this.opts.item.type;
    const value = this.opts.item.cell;
    if (type === 'object' || type === 'array') {
      return;
    }
    if (type === 'string') {
      const split = value.split('.');
      if (!!split.length && contains(['jpg', 'png', 'gif'], split[split.length - 1])) {
        return;
      }
    }

    Promise
      .resolve()
      .then(() => {
        const tmpElm = document.createElement('textarea');
        tmpElm.value = value;
        tmpElm.selectionStart = 0;
        tmpElm.selectionEnd = tmpElm.value.length;
        const tmpStyle = tmpElm.style;
        tmpStyle.position = 'fixed';
        tmpStyle.left = '-100%';
        document.body.appendChild(tmpElm);
        tmpElm.focus();
        const result = document.execCommand('copy');
        tmpElm.blur();
        document.body.removeChild(tmpElm);
        if (!result) {
          throw new Error();
        }
      })
      .then(() => store.action(actions.TOASTS_ADD, {
        message: 'クリップボードにコピーしました。'
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'dmc-message', {
        title: 'コピー失敗',
        message: 'ご使用中の環境ではクリップボードへコピー出来ません。',
        error: err
      }));

  };
}
