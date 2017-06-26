export default function() {
  this.handleClickb = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onchange && this.opts.onchange(!this.opts.ischecked);
  };
}
