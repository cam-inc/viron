// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;

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
