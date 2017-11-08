import isString from 'mout/lang/isString';
import forOwn from 'mout/object/forOwn';
import ObjectAssign from 'object-assign';
import Quill from '../../../core/quill';
import { customizeBlot } from '../../../core/quill';

export default function() {
  const blotOptions = this.opts.blotoptions || {};

  // quillインスタンス。
  this.quill = null;
  // quillのbubble用cssを使用するか否か。
  this.isBubbled = !blotOptions['external-css-file'];

  // Blotを変更します。
  forOwn(blotOptions || {}, (value, key) => {
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
      //debug: true,
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
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }, { 'size': [false, 'small', 'large', 'huge'] }, { 'font': [] }],
          ['link'],
          ['code', { 'script': 'sub' }, { 'script': 'super' }],
          ['clean']
        ]
      },
      // @see: https://quilljs.com/docs/configuration/#placeholder
      placeholder: 'type here...',
      // @see: https://quilljs.com/docs/configuration/#readonly
      readonly: this.opts.isdisabled,
      // @see: https://quilljs.com/docs/configuration/#scrollingcontainer
      scrollingContainer: null,
      // @see: https://quilljs.com/docs/configuration/#strict
      strict: true,
      // @see: https://quilljs.com/docs/configuration/#theme
      theme: 'bubble'
    };
    return options;
  };

  this.on('mount', () => {
    this.quill = new Quill(this.refs.editor, getOption());
    // TODO: 後で消すこと。
    window.quill = this.quill;
    this.quill.on(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.on(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.on(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
    if (isString(blotOptions.initialInnerHtml)) {
      this.quill.pasteHTML(blotOptions.initialInnerHtml);
    }
    // load external css file if any specified.
    const externalCssFilePath = blotOptions['external-css-file'];
    if (!!externalCssFilePath) {
      const headElm = document.querySelector('head');
      const linkElm = document.createElement('link');
      linkElm.rel = 'stylesheet';
      linkElm.href = externalCssFilePath;
      linkElm.setAttribute('data-targetid', this._riot_id);
      // head要素内の先頭に配置。
      headElm.insertBefore(linkElm, headElm.firstChild);
    }
    this.update();
    this.quill.enable(!this.opts.isdisabled);
  }).on('unmount', () => {
    this.quill.off(Quill.events.TEXT_CHANGE, this.handleTextChange);
    this.quill.off(Quill.events.SELECTION_CHANGE, this.handleSelectionChange);
    this.quill.off(Quill.events.EDITOR_CHANGE, this.handleEditorChange);
    this.quill.off(Quill.events.SCROLL_OPTIMIZE, this.handleScrollOptimize);
    // remove external css file if any.
    const linkElm = document.querySelector(`link[data-targetid="${this._riot_id}"]`);
    if (!!linkElm) {
      linkElm.remove();
    }
  });

  /**
   * 文章が変更された時の処理。
   * @see: https://quilljs.com/docs/api/#text-change
   * @param {Quill.Delta} delta
   * @param {Quill.Delta} oldContent
   * @param {String} source "user", "api" or "silent"
   */
  this.handleTextChange = (delta, oldContent, source) => {// eslint-disable-line no-unused-vars
    // querySelectorとinnerHTMLで内容を抜くのはNGだがQuillにAPIが用意されていないので仕方なく。
    const editorElm = this.quill.container.querySelector('.ql-editor');
    if (!editorElm) {
      return;
    }
    this.opts.ontextchange && this.opts.ontextchange(editorElm.innerHTML);
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
  this.handleDividerClick = () => {
    const range = quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'myDivider', true, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
  };
  */
}
