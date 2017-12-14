export default function() {
  const store = this.riotx.get();

  this.mediapreviews = store.getter('mediapreviews.all');
  this.listen('mediapreviews', () => {
    this.mediapreviews = store.getter('mediapreviews.all');
    this.update();
  });
}
