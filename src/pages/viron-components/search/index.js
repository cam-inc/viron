export default function() {
  this.val = {};

  this.handleParametersChange = newValue => {
    this.val = newValue;
    this.update();
  };
}
