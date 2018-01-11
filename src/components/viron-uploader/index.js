export default function() {
  this.inputId = `Uploader__input${this._riot_id}`;
  this.file = null;
  this.fileName = null;
  this.isTypeOfImage = false;
  this.isTypeOfCsv = false;
  this.isTypeOfOther = false;
  this.blobURL = this.opts.initialbloburl || null;
  this.isDragWatching = false;
  this.isDroppable = false;

  this.reset = () => {
    window.URL.revokeObjectURL(this.blobURL);
    this.refs.form.reset();
    this.file = null;
    this.fileName = null;
    this.isTypeOfImage = false;
    this.isTypeOfCsv = false;
    this.isTypeOfOther = false;
    this.blobURL = this.opts.initialbloburl || null;
    this.opts.onchange && this.opts.onchange(this.file, this.blobURL);
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
    if (!this.opts.onchange) {
      return;
    }
    if (this.opts.isdisabled) {
      return;
    }
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
    if (file.type.indexOf('image/') === 0) {
      this.isTypeOfImage = true;
      this.isTypeOfCsv = false;
      this.isTypeOfOther = false;
    } else if (file.type.indexOf('text/csv') === 0) {
      this.isTypeOfImage = false;
      this.isTypeOfCsv = true;
      this.isTypeOfOther = false;
    } else {
      this.isTypeOfImage = false;
      this.isTypeOfCsv = false;
      this.isTypeOfOther = true;
    }
    this.blobURL = window.URL.createObjectURL(file);
    this.opts.onchange(this.file, this.blobURL);
  };

  this.handleHandlerDragEnter = e => {
    e.preventDefault();
    if (this.opts.isdisabled) {
      return;
    }
    this.isDragWatching = true;
    this.update();
  };

  this.handleHandlerDragOver = e => {
    e.preventDefault();
  };

  this.handleHandlerDragLeave = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.isDragWatching = false;
    this.update();
  };

  this.handleHandlerDrop = e => {
    e.preventDefault();
    if (this.opts.isdisabled) {
      return;
    }
    this.isDragWatching = false;
    this.update();
    this.handleFileChange(e, true);
  };

  this.handleResetButtonTap = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.reset();
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
