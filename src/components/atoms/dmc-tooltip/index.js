export default function() {
  this.show = () => {
    // need to set delay after dom mountation.
    new Promise(resolve => {
      setTimeout(() => {
        this.root.classList.add('Tooltip--visible');
        resolve();
      }, 0);
    }).then(() => {
      this.root.classList.add('Tooltip--active');
    });
  };

  this.on('mount', () => {
    this.show();
  });
}
