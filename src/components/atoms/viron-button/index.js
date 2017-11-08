export default function() {
  this.handleTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onppat && this.opts.onppat(this.opts.id);
  };
}
