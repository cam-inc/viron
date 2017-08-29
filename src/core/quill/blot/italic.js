// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotItalic = Quill.import('formats/italic');

class BlotItalic extends QuillBlotItalic { }

export default BlotItalic;
