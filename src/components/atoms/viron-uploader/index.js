export default function() {
  this.inputId = `Uploader__input${Date.now()}`;
  this.file = null;
  this.fileName = null;
  this.isTypeOfImage = false;
  this.blobURL = this.opts.initialbloburl || null;
  this.isDragWatching = false;
  this.isDroppable = false;

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

  /**
   * fileが変更された時の処理。
   * DnD経由でも実行されます。
   * @param {Object} e
   * @param {Boolean} fromDnD Dnd経由か否か。
   */
  this.handleFileChange = (e, fromDnD) => {
    let files;
    if (fromDnD) {
      files = e.dataTransfer.files;
    } else {
      files = e.target.files;
    }
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

  this.handleHandlerDragEnter = e => {
    e.preventDefault();
    this.isDragWatching = true;
    this.update();
  };

  this.handleHandlerDragOver = e => {
    e.preventDefault();
  };

  this.handleHandlerDragLeave = () => {
    this.isDragWatching = false;
    this.update();
  };

  this.handleHandlerDrop = e => {
    e.preventDefault();
    this.isDragWatching = false;
    this.update();
    this.handleFileChange(e, true);
  };

  this.handleResetButtonClick = () => {
    this.reset();
  };
}
