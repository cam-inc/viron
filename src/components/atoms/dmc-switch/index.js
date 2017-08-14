export default function() {
  this.handleKnobPat = () => {
    if(!this.opts.isdisabled) {
      this.opts.ontoggle(!this.opts.ischecked);
    }
  };
}