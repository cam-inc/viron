export default function() {
  this.handleClick = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onchange && this.opts.onchange(!this.opts.ischecked, this.opts.id);
  };
}
