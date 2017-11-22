export default function() {
  const store = this.riotx.get();

  this.endpoints = store.getter('endpoints.allByOrder');

  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrder');
    this.update();
  });
}
