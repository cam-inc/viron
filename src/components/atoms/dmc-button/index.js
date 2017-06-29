export default function() {
  this.handleTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onpat && this.opts.onpat(this.opts.id);
  };
}
