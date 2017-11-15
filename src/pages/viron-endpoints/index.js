export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter('endpoints.allByOrderFiltered');

  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
}
