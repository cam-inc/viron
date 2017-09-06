export default function() {
  this.handleCheckboxChange = newIsChecked => {
    this.opts.ontoggle(this.opts.item, newIsChecked);
  };
}
