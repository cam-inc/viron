export default function() {
  this.inputId = `Uploader__input${Date.now()}`;
  this.file = null;
  this.blobURL = this.opts.initialbloburl || null;

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.reset = () => {
    window.URL.revokeObjectURL(this.blobURL);
    this.refs.form.reset();
    this.file = null;
    this.blobURL = this.opts.initialbloburl || null;
    this.opts.onfilechange && this.opts.onfilechange(this.file, this.blobURL);
    this.update();
  };

  this.handleFileChange = e => {
    const files = e.target.files;
    if (!files.length) {
      this.reset();
      return;
    }

    const file = files[0];
    this.file = file;
    this.blobURL = window.URL.createObjectURL(file);
    this.opts.onfilechange && this.opts.onfilechange(this.file, this.blobURL);
    this.update();
  };

  this.handleResetButtonTap = () => {
    this.reset();
  };
}
