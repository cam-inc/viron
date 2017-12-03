export default function() {
  this.handleTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    if (!this.opts.onselect) {
      return;
    }
    this.opts.onselect();
  };
}
