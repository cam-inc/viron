export default function() {
  this.inputId = `Uploader__input${Date.now()}`;
  this.file = null;
  this.fileName = null;
  this.isTypeOfImage = false;
  this.blobURL = this.opts.initialbloburl || null;

  this.on('updated', () => {
    this.rebindTouchEvents();
  });

  this.reset = () => {
    window.URL.revokeObjectURL(this.blobURL);
    this.refs.form.reset();
    this.file = null;
    this.fileName = null;
    this.isTypeOfImage = false;
    this.blobURL = this.opts.initialbloburl || null;
    this.opts.onfilechange && this.opts.onfilechange(this.file, this.blobURL);
    this.update();
  };

  this.handleChange = e => {
    e.stopPropagation();
  };

  this.handleFileChange = e => {
    const files = e.target.files;
    if (!files.length) {
      this.reset();
      return;
    }

    const file = files[0];
    this.file = file;
    this.fileName = file.name;
    this.isTypeOfImage = (file.type.indexOf('image/') === 0);
    this.blobURL = window.URL.createObjectURL(file);
    this.opts.onfilechange && this.opts.onfilechange(this.file, this.blobURL);
    this.update();
  };

  this.handleResetButtonTap = () => {
    this.reset();
  };
}
