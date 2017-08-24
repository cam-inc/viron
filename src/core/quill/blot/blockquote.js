// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotBlockquote = Quill.import('formats/blockquote');

class BlotBlockquote extends QuillBlotBlockquote {
}

export default BlotBlockquote;
