// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotBold = Quill.import('formats/bold');

class BlotBold extends QuillBlotBold {
}

export default BlotBold;
