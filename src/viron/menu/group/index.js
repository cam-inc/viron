export default function() {
  const store = this.riotx.get();

  this.isOpened = false;

  this.getPagesHeight = () => {
    if (!this.isOpened) {
      return 0;
    }
    const elm = this.refs.pagesInner;
    if (!elm) {
      return 0;
    }
    const rect = elm.getBoundingClientRect();
    return rect.height;
  };

  this.handleHeadTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleIndependentHeadTap = () => {
    this.opts.closer();
    const id = this.opts.group.pages[0].id;
    this.getRouter().navigateTo(`/${store.getter('current.all')}/${id}`);
  };

  this.handlePageTap = e => {
    this.opts.closer();
    const id = e.item.page.id;
    this.getRouter().navigateTo(`/${store.getter('current.all')}/${id}`);
  };
}
