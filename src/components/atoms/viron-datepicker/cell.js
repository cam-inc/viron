export default function() {
  this.handleClick = () => {
    this.opts.onclick(this.opts.date);
  };
}
