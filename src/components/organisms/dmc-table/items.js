import sortBy from 'mout/array/sortBy';

export default function() {
  // sort済みのitems。
  this.sortedItems = sortBy(this.opts.items, item => {
    return (this.opts.tablelabels || []).indexOf(item.key) * (-1);
  });
  this.title = this.sortedItems[0].cell;
  this.isOpened = true;

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
