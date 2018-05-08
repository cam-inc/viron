export default function() {
  let isoString = this.opts.isoString;
  this.handleTimepickerChange = newIsoString => {
    isoString = newIsoString;
  };

  this.handleOKButtonTap = () => {
    this.close();
    if (!this.opts.onSubmit) {
      return;
    }
    this.opts.onSubmit(isoString);
  };
}
