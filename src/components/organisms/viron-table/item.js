import contains from 'mout/array/contains';
import clipboard from 'clipboard-js';
import { constants as actions } from '../../../store/actions';
import { constants as getters } from '../../../store/getters';
import '../../atoms/viron-message/index.tag';

export default function() {
  const store = this.riotx.get();

  this.handleClick = () => {
    // ブラウザによってコピー機能を無効化する。
    if (store.getter(getters.UA_IS_EDGE)) {
      return;
    }
    if (store.getter(getters.UA_IS_FIREFOX)) {
      return;
    }

    // クリップボードにコピーできないタイプであればスルーする。
    const type = this.opts.item.type;
    let value = this.opts.item.cell;
    if (type === 'object' || type === 'array') {
      return;
    }

    // 画像ファイルであればスルーする。
    if (type === 'string') {
      const split = value.split('.');
      const extension = ['jpg', 'jpeg', 'bmp', 'png', 'gif'];
      if (!!split.length && contains(extension, split[split.length - 1])) {
        return;
      }
    }

    // Stringに変換する
    value = String(value);

    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(value);
      })
      .then(() => store.action(actions.TOASTS_ADD, {
        message: 'クリップボードにコピーしました。'
      }))
      .catch(err => store.action(actions.MODALS_ADD, 'viron-message', {
        title: 'コピー失敗',
        message: 'ご使用中の環境ではクリップボードへコピー出来ません。',
        error: err
      }));

  };
}
