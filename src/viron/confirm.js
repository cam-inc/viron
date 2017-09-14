export default function() {
  this.handleDeleteButtonPat = () => {
    this.opts.onConfirm();
    this.close();
  };

  this.handleCancelButtonPat = () => {
    this.close();
  };
}
