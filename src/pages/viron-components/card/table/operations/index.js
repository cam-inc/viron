export default function() {
  this.handleItemSelect = operationObject => {
    this.close();
    this.opts.onSelect(operationObject);
  };
}
