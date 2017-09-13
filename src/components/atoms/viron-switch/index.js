export default function() {
  this.handleGroovePat = () => {
    if (!this.opts.isdisabled) {
      this.opts.ontoggle(!this.opts.ischecked);
    }
  };
}