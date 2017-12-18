export default function() {
  const store = this.riotx.get();

  this.isDesktop = store.getter('layout.isDesktop');
  this.isMobile = store.getter('layout.isMobile');
  this.layoutType = store.getter('layout.type');
  this.endpoints = store.getter('endpoints.allByOrderFiltered');
  // エンドポイントカードがDnD可能な状態か否か。
  this.isDraggable = true;

  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.layoutType = store.getter('layout.type');
    this.update();
  });

  this.handleOrderButtonTap = () => {
    this.isDraggable = !this.isDraggable;
    this.update();
  };
}
