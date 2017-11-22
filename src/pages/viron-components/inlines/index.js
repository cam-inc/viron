export default function() {
  const store = this.riotx.get();

  this.components = store.getter('page.componentsInline');

  this.listen('page', () => {
    this.components = store.getter('page.componentsInline');
    this.update();
  });
}
