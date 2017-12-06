export default function() {
  const store = this.riotx.get();

  this.popovers = store.getter('popovers.all');
  this.isDesktop = store.getter('layout.isDesktop');
  this.isMobile = store.getter('layout.isMobile');
  this.listen('popovers', () => {
    this.popovers = store.getter('popovers.all');
    this.update();
  });
  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });
}
