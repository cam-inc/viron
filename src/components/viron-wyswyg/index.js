import throttle from 'mout/function/throttle';
import ObjectAssign from 'object-assign';

// TODO: Froalaを購入すること。
// Froala WYSWYG EditorがjQuery依存。
// jQuery使いたくないけど、Froalaは使いたいので仕方なく。
const $ = window.$;

// Froalaエディタのオプション群。
const defaultEditorOptions = {
  // 文字数カウンタを非表示に。
  charCounterCount: false,
  // 画像等の文字間へのDnDを許可しない。
  dragInline: false,
  // 高さ調整。
  heightMin: 100,
  heightMax: 500,
  // 言語設定 TODO: どの言語を使っているか、i18nextから取得したい。
  language: 'ja',
  placeholderText: 'Start typing here...',
  // コピペ時に余分タグをペーストしない。
  pastePlain: true,
  // 選択範囲のスタイルをtoolbarに詳細表示する。
  fontFamilySelection: true,
  fontSizeSelection: true,
  paragraphFormatSelection: true,
  // toolbarが上部吸着しないように。
  toolbarSticky: false,
  // toolbarボタン群。
  toolbarButtons: [
    'fullscreen', 'html', '|', 'undo', 'redo', 'selectAll', 'clearFormatting', '|', 'help', '-',
    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'insertLink', 'insertImage', '|', 'fontFamily', 'fontSize', 'color', '-',
    'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertTable', 'insertHR'
  ],
  // 小さい画面でもtoolbarButtonsと同じボタン群を表示するためにnullをセット。
  toolbarButtonsSM: null,
  toolbarButtonsXS: null,
  // リンクプラグイン設定。
  linkEditButtons: 	['linkOpen', 'linkEdit', 'linkRemove'],
  linkList: [{
    text: 'Viron',
    href: 'https://cam-inc.github.io/viron-doc/',
    target: '_blank'
  }],
  // 画像プラグイン設定。
  imageDefaultWidth: 80,
  imageEditButtons: ['imageReplace', 'imageAlign', 'imageCaption', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
  imageUpload: false,
  imageUploadRemoteUrls: false,
  // p, div or brを指定可能。
  enter: $.FroalaEditor.ENTER_P,
  // ショートカット可能なボタン群。
  shortcutsEnabled: ['bold', 'italic']
};

export default function() {
  this.on('mount', () => {
    // 初期値をセットする。
    this.refs.editor.innerHTML = this.opts.val || '';
    // エディター作成。
    $(this.refs.editor)
      .on('froalaEditor.contentChanged', this.handleEditorChange)
      .on('froalaEditor.focus', this.handleEditorFocus)
      .on('froalaEditor.blur', this.handleEditorBlur)
      .froalaEditor(ObjectAssign({}, defaultEditorOptions, {
        // 上書きするならここに。
      }));
  }).on('before-unmount', () => {
    $(this.refs.editor)
      .off('froalaEditor.contentChanged', this.handleEditorChange)
      .off('froalaEditor.focus', this.handleEditorFocus)
      .off('froalaEditor.blur', this.handleEditorBlur);
  });

  // 発火回数を間引く。
  this.handleEditorChange = throttle((e, editor) => {
    if (!this.opts.onchange) {
      return;
    }
    const html = editor.html.get();
    this.opts.onchange(html);
  }, 1000);

  this.handleEditorFocus = (e, editor) => {// eslint-disable-line no-unused-vars
    if (!this.opts.onfocus) {
      return;
    }
    this.opts.onfocus();
  };

  this.handleEditorBlur = (e, editor) => {// eslint-disable-line no-unused-vars
    if (!this.opts.onblur) {
      return;
    }
    this.opts.onblur();
  };
}
