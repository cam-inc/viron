export default function() {
  this.handleClick = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onppat && this.opts.onppat(this.opts.id);
  };
}
