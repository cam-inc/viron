import Quill from '../../../core/Quill';

export default function() {
  // quillインスタンス。
  let quill = null;
  const options = {
    // @see: https://quilljs.com/docs/configuration/#bounds
    bounds: this.refs.editor,
    // @see: https://quilljs.com/docs/configuration/#debug
    debug: true,
    // @see: https://quilljs.com/docs/configuration/#formats
    // @see https://quilljs.com/docs/formats/
    //formats: [],
    // @see: https://quilljs.com/docs/configuration/#modules
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']
      ]
    },
    // @see: https://quilljs.com/docs/configuration/#placeholder
    placeholder: 'type here...',
    // @see: https://quilljs.com/docs/configuration/#readonly
    readonly: false,
    // @see: https://quilljs.com/docs/configuration/#scrollingcontainer
    scrollingContainer: null,
    // @see: https://quilljs.com/docs/configuration/#strict
    strict: true,
    // @see: https://quilljs.com/docs/configuration/#theme
    theme: 'snow'
  };
  this.on('mount', () => {
    quill = new Quill(this.refs.editor, options);
    quill.on('text-change', this.handleTextChange);
    quill.on('selection-change', this.handleSelectionChange);
    quill.on('editor-change', this.handleEditorChange);
  }).on('updated', () => {
    this.opts.isdisabled ? quill.disable() : quill.enable();
  }).on('unmount', () => {
    quill.off('text-change', this.handleTextChange);
    quill.off('selection-change', this.handleSelectionChange);
    quill.off('editor-change', this.handleEditorChange);
    // TODO: dispose
  });

  /**
   * 文章が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#text-change
   * @param {Quill.Delta} delta
   * @param {Quill.Delta} oldContent
   * @param {String} source "user", "api" or "silent"
   */
  this.handleTextChange = (delta, oldContent, source) => {};

  /**
   * 選択範囲が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#selection-change
   * @param {Object} range { index: Number, length: Number }
   * @param {Object} oldRange { index: Number, length: Number }
   * @param {String} source "user", "api" or "silent"
   */
  this.handleSelectionChange = (range, oldRange, source) => {};

  /**
   * 文章もしくは選択範囲が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#editor-change
   * @param {String} name "text-change" or "selection-change"
   * @param {Array} args
   */
  this.handleEditorChange = (name, ...args) => {};
}
