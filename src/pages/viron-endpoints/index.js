export default function() {
  const store = this.riotx.get();

  this.isDesktop = store.getter('layout.isDesktop');
  this.endpoints = store.getter('endpoints.allByOrderFiltered');

  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.update();
  });

  this.handleOrderButtonTap = () => {
    // TODO: 並び替え
  };
}
