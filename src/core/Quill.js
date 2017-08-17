// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

// style属性ではなくclass属性を使う。
// @see: https://quilljs.com/guides/how-to-customize-quill/#class-vs-inline
const ClassAttributorAlign = Quill.import('attributors/class/align');
const ClassAttributorBackground = Quill.import('attributors/class/background');
const ClassAttributorColor = Quill.import('attributors/class/color');
const ClassAttributorDirection = Quill.import('attributors/class/direction');
const ClassAttributorFont = Quill.import('attributors/class/font');
const ClassAttributorSize = Quill.import('attributors/class/size');
ClassAttributorFont.whitelist = [
  'sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'
];
Quill.register(ClassAttributorAlign, true);
Quill.register(ClassAttributorBackground, true);
Quill.register(ClassAttributorColor, true);
Quill.register(ClassAttributorDirection, true);
Quill.register(ClassAttributorFont, true);
Quill.register(ClassAttributorSize, true);

// 使用DOM要素を変更します。
const BlotAlign = Quill.import('formats/align');
const BlotBackground = Quill.import('formats/background');
const BlotBlockquote = Quill.import('formats/blockquote');
const BlotBold = Quill.import('formats/bold');
const BlotCode = Quill.import('formats/code');
const BlotCodeBlock = Quill.import('formats/code-block');
const BlotColor = Quill.import('formats/color');
const BlotDirection = Quill.import('formats/direction');
const BlotFont = Quill.import('formats/font');
const BlotFormula = Quill.import('formats/formula');
const BlotHeader = Quill.import('formats/header');
const BlotImage = Quill.import('formats/image');
const BlotIndent = Quill.import('formats/indent');
const BlotItalic = Quill.import('formats/italic');
const BlotLink = Quill.import('formats/link');
const BlotList = Quill.import('formats/list');
const BlotListItem = Quill.import('formats/list/item');
const BlotScript = Quill.import('formats/script');
const BlotSize = Quill.import('formats/size');
const BlotStrike = Quill.import('formats/strike');
const BlotToken = Quill.import('formats/token');
const BlotUnderline = Quill.import('formats/underline');
const BlotVideo = Quill.import('formats/video');
//BlotBold.tagName = 'span';
//BlotBold.className = 'custom__eee--bold';
//BlotBold.optimize = () => {};
class CustomBlotBold extends BlotBold {
  optimize(context) {
    //
  }
}
CustomBlotBold.tagName = 'span';
//CustomBlotBold.tagName = 'SPAN';
Quill.register(BlotAlign, true);
Quill.register(BlotBackground, true);
Quill.register(BlotBlockquote, true);
Quill.register(BlotBold, true);
Quill.register(CustomBlotBold, true);
Quill.register(BlotCode, true);
Quill.register(BlotCodeBlock, true);
Quill.register(BlotColor, true);
Quill.register(BlotDirection, true);
Quill.register(BlotFont, true);
Quill.register(BlotFormula, true);
Quill.register(BlotHeader, true);
Quill.register(BlotImage, true);
Quill.register(BlotIndent, true);
Quill.register(BlotItalic, true);
Quill.register(BlotLink, true);
Quill.register(BlotList, true);
Quill.register(BlotListItem, true);
Quill.register(BlotScript, true);
Quill.register(BlotSize, true);
Quill.register(BlotStrike, true);
Quill.register(BlotToken, true);
Quill.register(BlotUnderline, true);
Quill.register(BlotVideo, true);

// import from Quill.
const Clipboard = Quill.import('modules/clipboard');
const Delta = Quill.import('delta');

// QuillのClipboardを継承して独自Clipboardを作成する。
class PlainClipboard extends Clipboard {
  convert(html = null) {
    if (typeof html === 'string') {
      this.container.innerHTML = html;
    }
    const text = this.container.innerText;
    this.container.innerHTML = '';
    return new Delta().insert(text);
  }
}

Quill.register('modules/clipboard', PlainClipboard, true);

export default Quill;
