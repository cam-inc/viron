export default function() {
  this.handlePositiveSelect = () => {
    this.close();
    if (!this.opts.onPositiveSelect) {
      return;
    }
    this.opts.onPositiveSelect();
  };

  this.handleNegativeSelect = () => {
    this.close();
    if (!this.opts.onNegativeSelect) {
      return;
    }
    this.opts.onNegativSselect();
  };
}
