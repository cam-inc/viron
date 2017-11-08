export default function() {
  this.handleButtonClick = () => {
    this.opts.onclick(this.opts.authtype);
  };
}
