export default function() {
  this.isActive = false;
  this.on('mount', () => {
    setTimeout(() => {
      this.isActive = true;
      this.update();
    }, 100);
  });
}
