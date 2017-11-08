import contains from 'mout/array/contains';
import filter from 'mout/array/filter';
import sortBy from 'mout/array/sortBy';
import isArray from 'mout/lang/isArray';
import { constants as actions } from '../../../store/actions';
import './flatitems.tag';

export default function() {
  const store = this.riotx.get();

  // sort済みのitems。
  // どのorder値よりも大きいであろう適当な値。
  const bigNumber = 9999;
  this.sortedItems = sortBy(this.opts.items, item => {
    const labels = this.opts.tablelabels || [];
    if (contains(labels, item.key)) {
      return labels.indexOf(item.key);
    } else {
      return bigNumber;
    }
  });
  this.title = this.sortedItems[0].cell;
  this.isOpened = true;
  this.isTooltipVisible = false;

  this.getFilteredItems = () => {
    const items = this.sortedItems;
    const columns = this.opts.selectedtablecolumns;
    if (!isArray(columns) || !columns.length) {
      return items;
    }
    return filter(items, item => {
      return contains(columns, item.key);
    });
  };

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.handleHeaderTitleTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleItemsActionButtonPpat = action => {
    action.onPpat(action.operationId, this.opts.idx);
  };

  this.handleOpenShutButtonPpat = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleDetailButtonTap = () => {
    store.action(actions.DRAWERS_ADD, 'viron-table-flatitems', {
      items: this.sortedItems
    });
  };

  this.handleDetailButtonMouseOver = () => {
    this.isTooltipVisible = true;
    this.update();
  };

  this.handleDetailButtonMouseOut = () => {
    this.isTooltipVisible = false;
    this.update();
  };
}
