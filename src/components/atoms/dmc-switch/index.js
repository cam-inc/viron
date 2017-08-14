export default function() {
  this.handleKnobPat = () => {
    this.opts.ontoggle(!this.opts.ischecked);
  };
}