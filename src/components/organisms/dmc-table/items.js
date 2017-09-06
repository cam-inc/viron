import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import sortBy from 'mout/array/sortBy';
import isArray from 'mout/lang/isArray';

export default function() {
  // sort済みのitems。
  this.sortedItems = sortBy(this.opts.items, item => {
    return (this.opts.tablelabels || []).indexOf(item.key) * (-1);
  });
  this.title = this.sortedItems[0].cell;
  this.isOpened = true;

  this.getFilteredItems = () => {
    const items =  this.sortedItems;
    const columns = this.opts.selectedtablecolumns;
    if (!isArray(columns) || !columns.length) {
      return items;
    }
    return filter(items, item => {
      return contains(columns, item.key);
    });
  };

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
