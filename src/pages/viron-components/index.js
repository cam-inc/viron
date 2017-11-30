export default function() {
  const store = this.riotx.get();

  this.name = store.getter('page.name');
  this.components = store.getter('page.components');
  this.listen('page', () => {
    this.name = store.getter('page.name');
    this.components = store.getter('page.components');
    this.update();
  });
}
