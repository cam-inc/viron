export default function() {
  const store = this.riotx.get();

  this.drawers = store.getter('drawers.all');

  this.listen('drawers', () => {
    this.drawers = store.getter('drawers.all');
    this.update();
  });
}
