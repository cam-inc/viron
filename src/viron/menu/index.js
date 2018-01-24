export default function() {
  const store = this.riotx.get();

  this.closer = () => {
    this.close();
  };

  this.menu = store.getter('viron.menu');
  // レスポンシブデザイン用。
  this.layoutType = store.getter('layout.type');
  this.isDesktop = store.getter('layout.isDesktop');
  this.isMobile = store.getter('layout.isMobile');

  this.listen('viron', () => {
    this.menu = store.getter('viron.menu');
    this.update();
  });
  this.listen('layout', () => {
    if (!this.isMounted) {
      return;
    }
    this.layoutType = store.getter('layout.type');
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.update();
  });

  this.handleHomeButtonTap = () => {
    this.close();
    this.getRouter().navigateTo('/');
  };
}
