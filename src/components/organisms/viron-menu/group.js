import find from 'mout/array/find';
import map from 'mout/array/map';
export default function() {
  const store = this.riotx.get();

  this.isOpened = false;
  const pageId = store.getter('page.id');
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

  this.listen('page', () => {
    const pageId = store.getter('page.id');
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

  this.handleToggleClick = () => {
    if (this.opts.group.isIndependent) {
      this.getRouter().navigateTo(`/${store.getter('current.all')}/${this.opts.group.list[0].id}`);
    } else {
      this.isOpened = !this.isOpened;
      this.update();
    }
  };

  this.handleGroupItemClick = e => {
    const pageName = this.opts.group.list[Number(e.currentTarget.getAttribute('data-idx'))].id;
    this.getRouter().navigateTo(`/${store.getter('current.all')}/${pageName}`);
  };
}
