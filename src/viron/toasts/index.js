export default function() {
  const store = this.riotx.get();

  this.toasts = store.getter('toasts.all');

  this.listen('toasts', () => {
    this.toasts = store.getter('toasts.all');
    this.update();
  });
}
