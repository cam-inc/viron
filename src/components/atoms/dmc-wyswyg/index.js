import forOwn from 'mout/object/forOwn';
import Quill from '../../../core/quill';

export default function() {
  // quillインスタンス。
  let quill = null;

  const blotOptions = this.opts.blotoptions || {
    background: { className: 'Wsywyg__background' },
    bold: { className: 'Wsywyg__bold' },
    italic: { className: 'Wyswyg__italic' }
  };
  // Blotを変更します。
  forOwn(blotOptions, (value, key) => {
    const params = {};
    if (!!value.tagName) {
      params.tagName = value.tagName;
    }
    if (!!value.className) {
      params.className = value.className;
    }
    Quill.customizeBlot(key, params);
  });

  /**
   * Quillのoptionを返します。
   * @return {Object}
   */
  const getOption = () => {
    const options = {
      // @see: https://quilljs.com/docs/configuration/#bounds
      bounds: this.refs.editor,
      // @see: https://quilljs.com/docs/configuration/#debug
      debug: true,
      // @see: https://quilljs.com/docs/configuration/#formats
      // @see https://quilljs.com/docs/formats/
      formats: [
        // inlineレベルのformat群。
        'background',// Background Color
        'bold',
        'color',
        'font',
        'code',// Inline Code
        'italic',
        'link',
        'size',
        'strike', //Strikethrough
        'script',// Superscript/Subscript
        'underline',
        // blockレベルのformat群。
        'blockquote',
        'header',
        'indent',
        'list',
        'align',
        'direction',// Direction of test
        'code-block',
        // embed系format群。
        'formula',
        'image',
        'video'
      ],
      // @see: https://quilljs.com/docs/configuration/#modules
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction
          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
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
    return options;
  };

  this.on('mount', () => {
    quill = Quill.create(this.refs.editor, getOption());
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
