// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotUnderline = Quill.import('formats/underline');

class BlotUnderline extends QuillBlotUnderline { }

export default BlotUnderline;
