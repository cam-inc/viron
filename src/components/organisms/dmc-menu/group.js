import find from 'mout/array/find';
import map from 'mout/array/map';
import { constants as getters } from '../../../store/getters';
import { constants as states } from '../../../store/states';

export default function() {
  const store = this.riotx.get();

  this.isOpened = false;
  const pageId = store.getter(getters.PAGE_ID);
  if (!!find(this.opts.group.list, item => {
    return (item.id === pageId);
  })) {
    this.isOpened = true;
  }
  map(this.opts.group.list, item => {
    if (item.id === pageId) {
      item.isSelected = true;
    } else {
      item.isSelected = false;
    }
    return item;
  });

  this.listen(states.PAGE, () => {
    const pageId = store.getter(getters.PAGE_ID);
    if (!!find(this.opts.group.list, item => {
      return (item.id === pageId);
    })) {
      this.isOpened = true;
    }
    map(this.opts.group.list, item => {
      if (item.id === pageId) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    this.update();
  });

  this.handleToggleTap = () => {
    if (this.opts.group.isIndependent) {
      this.getRouter().navigateTo(`/${store.getter(getters.CURRENT)}/${this.opts.group.list[0].id}`);
    } else {
      this.isOpened = !this.isOpened;
      this.update();
    }
  };

  this.handleGroupItemTap = e => {
    const pageName = this.opts.group.list[Number(e.currentTarget.getAttribute('data-idx'))].id;
    this.getRouter().navigateTo(`/${store.getter(getters.CURRENT)}/${pageName}`);
  };
}
