export default function() {
  const store = this.riotx.get();

  this.popovers = store.getter('popovers.all');
  this.listen('popovers', () => {
    this.popovers = store.getter('popovers.all');
    this.update();
  });
}
