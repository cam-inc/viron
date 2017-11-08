export default function() {
  this.handleGroovePpat = () => {
    if (!this.opts.isdisabled) {
      this.opts.ontoggle(!this.opts.ischecked);
    }
  };
}
