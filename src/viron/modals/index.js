export default function() {
  const store = this.riotx.get();

  this.modals = store.getter('modals.all');
  this.listen('modals', () => {
    this.modals = store.getter('modals.all');
    this.update();
  });
}
