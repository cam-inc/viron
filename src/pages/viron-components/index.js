export default function() {
  const store = this.riotx.get();

  this.name = store.getter('page.name');
  this.listen('page', () => {
    this.name = store.getter('page.name');
    this.update();
  });
}
