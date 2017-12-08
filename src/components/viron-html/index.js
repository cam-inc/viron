// TODO: froalaのCodeMirrowプラグインが使えるかも。

export default function() {
  /**
   * 入力値をhtmlに変換します。
   */
  const compile = () => {

  };

  // タブの選択状態。
  this.isEditorMode = true;
  this.isPreviewMode = false;

  this.on('mount', () => {
    compile();
    this.update();
  }).on('update', () => {
    compile();
  });

  this.handleEditorTabTap = () => {
    this.isEditorMode = true;
    this.isPreviewMode = false;
    this.update();
  };

  this.handlePreviewTabTap = () => {
    this.isEditorMode = false;
    this.isPreviewMode = true;
    this.update();
  };

  /**
   * editor値が変更された時の処理。
   * @param {String} newText
   */
  this.handleEditorChange = newText => {
    if (!this.opts.onchange) {
      return;
    }
    this.opts.onchange(newText);
  };

  this.handleBlockerTap = e => {
    e.stopPropagation();
  };
}
