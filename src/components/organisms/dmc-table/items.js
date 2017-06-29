import filter from 'mout/array/filter';
import find from 'mout/array/find';
import map from 'mout/array/map';
import { constants as actions } from '../../../store/actions';
import './action.tag';
import './filter.tag';

export default function() {
  const store = this.riotx.get();

  this.isOpened = false;
  this.title = '';
  // `id`を優先する。
  let item = find(this.opts.items, item => {
    return (item.key === 'id');
  });
  // `id`が無ければ適当に選ぶ。
  if (!item) {
    item = this.opts.items[0];
  }
  this.title = `${item.cell.getValue()}(${item.title})`;
  this.visibleKeys = map(this.opts.items, item => {
    return item.key;
  });
  // filterを通したリスト。
  this.getItems = () => {
    return filter(this.opts.items, item => {
      if (!find(this.visibleKeys, key => {
        return (key === item.key);
      })) {
        return false;
      }
      return true;
    });
  };
  this.filteredItems = this.getItems();

  this.handleHeaderTitleTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleActionButtonTap = () => {
    store.action(actions.MODALS_ADD, 'dmc-table-action', {
      actions: this.opts.actions,
      idx: this.opts.idx
    });
  };

  this.handleFilterButtonTap = () => {
    store.action(actions.MODALS_ADD, 'dmc-table-filter', {
      options: map(this.opts.items, item => {
        return item.key;
      }),
      selectedOptions: this.visibleKeys,
      onChange: selectedOptions => {
        this.visibleKeys = selectedOptions;
        this.filteredItems = this.getItems();
        this.update();
      }
    });
  };

  this.handleOpenShutButtonTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };
}
