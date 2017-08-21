import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import Quill from '../../../core/quill';
import { customizeBlot } from '../../../core/quill';

export default function() {
  // quillインスタンス。
  this.quill = null;

  const blotOptions = this.opts.options || {
    bold: { className: 'Wsywyg__bold', tagName: 'span' },
    italic: { className: 'Wyswyg__italic', tagName: 'i' },
    underline: { className: 'Wyswyg__underline', tagName: 'u' },
    strike: { className: 'Wyswyg__strike', tagName: 's' },
    color: { type: 'class', keyName: 'Wyswyg__color' },
    background: { type: 'class', keyName: 'Wyswyg__background' },
    font: { type: 'class', keyName: 'Wyswyg__font', whitelist: ['serif', 'monospace'] },
    size: { type: 'class', keyName: 'Wyswyg__size', whitelist: [false, '10px', '12px', '14px', '16px', '18px', '20px'] },
    link: { className: 'Wyswyg__link', tagName: 'a' },
    code: { className: 'Wyswyg__code', tagName: 'code' },
    script: { className: 'Wyswyg__script' },
    image: { className: 'Wyswyg__image', tagName: 'img' },
    video: { className: 'Wyswyg__video', tagName: 'video' },
    header: { className: 'Wyswyg__header' },
    list: { className: 'Wyswyg__list' },
    'list-item': { className: 'Wyswyg__listItem' },
    indent: { keyName: 'Wyswyg__indent' },
    align: { type: 'class', keyName: 'Wyswyg__align' },
    direction: { type: 'class', keyName: 'Wyswyg__direction' },
    blockquote: { className: 'Wyswyg__blockquote', tagName: 'blockquote' },
    'code-block': { className: 'Wyswyg__codeblock', tagName: 'pre' }
  };
  // Blotを変更します。
  forOwn(blotOptions, (value, key) => {
    customizeBlot(key, ObjectAssign({}, value));
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
        // toolbarにて表示する。
        'bold',
        'italic',
        'underline',
        'strike', //Strikethrough
        'color',
        'background',// Background Color
        'font',
        'size',
        'link',
        'code',// Inline Code
        'script',// Superscript/Subscript
        // embed系format群。
        // 独自toolbar内で表示する。
        'image',
        'video',
        // blockレベルのformat群。
        // 独自toolbar内で表示する。
        'header',
        'list',
        'indent',
        'align',
        'direction',// Direction of test
        'blockquote',
        'code-block'
      ],
      // @see: https://quilljs.com/docs/configuration/#modules
      modules: {
        toolbar: [
          ['blockquote'],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }, { 'size': [false, 'small', 'large', 'huge'] }, { 'font': [] }],
          ['link'],
          ['code', { 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
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
    this.quill = new Quill(this.refs.editor, getOption());
    // TODO:
    window.quill = this.quill;
    this.quill.on(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.on(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.on(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
    this.update();
  }).on('unmount', () => {
    this.quill.off(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.off(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.off(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.quill.off(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
    // TODO: dispose
  });

  /**
   * 文章が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#text-change
   * @param {Quill.Delta} delta
   * @param {Quill.Delta} oldContent
   * @param {String} source "user", "api" or "silent"
   */
  this.handleTextChange = (delta, oldContent, source) => {// eslint-disable-line no-unused-vars
  };

  /**
   * 選択範囲が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#selection-change
   * @param {Object} range { index: Number, length: Number }
   * @param {Object} oldRange { index: Number, length: Number }
   * @param {String} source "user", "api" or "silent"
   */
  this.handleSelectionChange = (range, oldRange, source) => {// eslint-disable-line no-unused-vars
  };

  /**
   * 文章もしくは選択範囲が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#editor-change
   * @param {String} name "text-change" or "selection-change"
   * @param {Array} args
   */
  this.handleEditorChange = (name, ...args) => {// eslint-disable-line no-unused-vars
  };

  /**
   * スクロール最適化された時の処理。
   */
  this.handleScrollOptimize = () => {};

  /**
   * `divider`ボタンがタップされた時の処理。
   */
  /*
  this.handleDividerPat = () => {
    const range = quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'myDivider', true, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
  };
  */
}
