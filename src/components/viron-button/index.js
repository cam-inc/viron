export default function() {
  this.handleTap = () => {
    if (!this.opts.onselect) {
      return;
    }
    this.opts.onselect();
  };
}
