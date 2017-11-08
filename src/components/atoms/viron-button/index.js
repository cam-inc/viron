export default function() {
  this.handleClick = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onclick && this.opts.onclick(this.opts.id);
  };
}
