export default function() {
  this.handleClick = () => {
    this.opts.onpat(this.opts.date);
  };
}
