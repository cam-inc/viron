import clipboard from 'clipboard-js';
import find from 'mout/array/find';
import findIndex from 'mout/array/findIndex';

export default function() {
  const store = this.riotx.get();

  this.isMobile = store.getter('layout.isMobile');
  this.selectedId = this.opts.initialSelectedId;
  this.selectedPath = find(this.opts.list, item => {
    return (item.id === this.selectedId);
  }).url;
  this.list = this.opts.list || [];
  this.hasPagination = false;
  this.isPrevEnabled = false;
  this.isNextEnabled = false;

  // Safariのbug対策。
  // body内でスクロールするとdrawerが消えるバグ。
  this.isReady = !this.isMobile;
  this.on('mount', () => {
    setTimeout(() => {
      this.isReady = true;
      this.update();
    }, 1000);

  });

  /**
   * ページング情報を更新します。
   */
  const updatePagination = () => {
    this.hasPagination = (this.list.length > 1);
    if (!this.hasPagination) {
      return;
    }
    const currentIdx = findIndex(this.list, item => {
      return (item.id === this.selectedId);
    });
    this.isPrevEnabled = (currentIdx > 0);
    this.isNextEnabled = (currentIdx < (this.list.length - 1));
  };
  updatePagination();

  /**
   * 閉じるボタンがタップされた時の処理。
   */
  this.handleCloseTap = () => {
    this.close();
  };

  /**
   * 削除ボタンがタップされた時の処理。
   */
  this.handleDeleteTap = () => {
    if (!this.opts.isDeletable) {
      return;
    }
    if (!this.opts.onDelete) {
      return;
    }
    const closer = () => {
      this.close();
    };
    this.opts.onDelete(this.selectedId, closer);
  };

  // クリップっボードコピーをサポートしているか否か。
  let isClipboardCopySupported = true;
  const clipboardCopy = val => {
    if (this.isMobile || !isClipboardCopySupported) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        return clipboard.copy(val);
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

  this.handleIdTap = () => {
    clipboardCopy(this.selectedId);
  };

  this.handlePathTap = () => {
    clipboardCopy(this.selectedPath);
  };

  this.handleInsertTap = () => {
    this.close();
    if (!this.opts.onInsert) {
      return;
    }
    this.opts.onInsert(this.selectedId);
  };

  /**
   * 前へボタンがタップされた時の処理。
   */
  this.handlePrevTap = () => {
    if (!this.isPrevEnabled) {
      return;
    }
    const currentIdx = findIndex(this.list, item => {
      return (item.id === this.selectedId);
    });
    let newIdx = currentIdx - 1;
    if (newIdx < 0) {
      newIdx = 0;
    }
    this.selectedId = this.list[newIdx].id;
    this.selectedPath = find(this.opts.list, item => {
      return (item.id === this.selectedId);
    }).url;
    updatePagination();
    this.update();
  };

  /**
   * 次へボタンがタップされた時の処理。
   */
  this.handleNextTap = () => {
    if (!this.isNextEnabled) {
      return;
    }
    const currentIdx = findIndex(this.list, item => {
      return (item.id === this.selectedId);
    });
    let newIdx = currentIdx + 1;
    if (newIdx > this.list.length - 1) {
      newIdx = this.list.length - 1;
    }
    this.selectedId = this.list[newIdx].id;
    this.selectedPath = find(this.opts.list, item => {
      return (item.id === this.selectedId);
    }).url;
    updatePagination();
    this.update();
  };
}
