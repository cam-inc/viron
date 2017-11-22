export default function() {
  const store = this.riotx.get();

  this.components = store.getter('page.componentsTable');
  this.listen('page', () => {
    this.components = store.getter('page.componentsTable');
    this.update();
  });
}
