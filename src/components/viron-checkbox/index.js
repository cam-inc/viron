export default function() {
  this.handleTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(!this.opts.ischecked, this.opts.id);
  };
}
