import filter from 'mout/array/filter';
import find from 'mout/array/find';
import forEach from 'mout/array/forEach';
import map from 'mout/array/map';
import { constants as actions } from '../../../store/actions';
import './filter.tag';

export default function() {
  const store = this.riotx.get();

  this.isOpened = false;
  this.title = '';
  // keyを指定されていればそれを使う。
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

  // 画面表示するkey群。
  let visibleKeys = map(this.opts.items, item => {
    return item.key;
  });
  // filterを通したリストを返す。
  const getItems = () => {
    return filter(this.opts.items, item => {
      if (!find(visibleKeys, key => {
        return (key === item.key);
      })) {
        return false;
      }
      return true;
    });
  };
  this.filteredItems = getItems();

  this.handleHeaderTitleTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleItemsActionButtonPat = action => {
    action.onPat(action.operationId, this.opts.idx);
  };

  this.handleFilterButtonPat = () => {
    store.action(actions.MODALS_ADD, 'dmc-table-filter', {
      options: map(this.opts.items, item => {
        return item.key;
      }),
      selectedOptions: visibleKeys,
      onChange: selectedOptions => {
        visibleKeys = selectedOptions;
        this.filteredItems = getItems();
        this.update();
      }
    });
  };

  this.handleOpenShutButtonPat = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };
}
