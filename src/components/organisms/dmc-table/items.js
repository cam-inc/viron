import find from 'mout/array/find';
import forEach from 'mout/array/forEach';

export default function() {

  this.isOpened = false;
  this.title = '';
  // keyが指定されていればそれを使う。
  let item;
  forEach(this.opts.tablelabels, key => {
    if (!!item) {
      return;
    }
    item = find(this.opts.items, item => {
      return (item.key === key);
    });
  });
  // `id`を優先する。
  if (!item) {
    item = find(this.opts.items, item => {
      return (item.key === 'id');
    });
  }
  // 適当に選ぶ。
  if (!item) {
    item = this.opts.items[0];
  }
  this.title = `${item.cell}`;

  this.handleHeaderTitleTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleItemsActionButtonPat = action => {
    action.onPat(action.operationId, this.opts.idx);
  };

  this.handleOpenShutButtonPat = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };
}
