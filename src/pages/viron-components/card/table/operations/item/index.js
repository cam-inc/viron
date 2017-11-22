export default function() {
  this.handleTap = () => {
    this.opts.onselect(this.opts.operation);
  };
}
