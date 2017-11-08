export default function() {
  this.handleDeleteButtonPpat = () => {
    this.opts.onConfirm();
    this.close();
  };

  this.handleCancelButtonPpat = () => {
    this.close();
  };
}
