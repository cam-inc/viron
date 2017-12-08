export default function() {
  this.handleTap = () => {
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onchange(!this.opts.ischecked, this.opts.id);
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
