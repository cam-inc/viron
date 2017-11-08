export default function() {
  this.handleDeleteButtonClick = () => {
    this.opts.onConfirm();
    this.close();
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
}
