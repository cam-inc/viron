export default function() {
  this.handleGrooveClick = () => {
    if (!this.opts.isdisabled) {
      this.opts.ontoggle(!this.opts.ischecked);
    }
  };
}
