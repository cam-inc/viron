export default function() {
  // 各タブの選択状態。
  this.isTabEditorSelected = true;
  this.isTabPreviewSelected = false;

  /**
   * htmlをコンパイルします。
   * @return {Object}
   */
  this.compileHtml = () => {
    const text = this.opts.text;
    const result = {
      status: ''
    };
    if (!text) {
      result.status = 'ready';
      return result;
    }
    try {
      result.status = 'success';
      result.message = 'コンパイル成功';
      result.html = text;
    } catch (err) {
      result.status = 'failed';
      result.message = err.message;
    }
    return result;
  };

  /**
   * editorタブがタップされた時の処理。
   */
  this.handleTabEditorTap = () => {
    this.isTabEditorSelected = true;
    this.isTabPreviewSelected = false;
    this.update();
  };

  /**
   * previewタブがタップされた時の処理。
   */
  this.handleTabPreviewTap = () => {
    this.isTabEditorSelected = false;
    this.isTabPreviewSelected = true;
    this.update();
  };

  /**
   * editor値が変更された時の処理。
   * @param {String} newText
   */
  this.handleEditorChange = newText => {
    this.opts.onchange && this.opts.onchange(newText);
  };
}
