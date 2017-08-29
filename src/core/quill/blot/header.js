// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotHeader = Quill.import('formats/header');

class BlotHeader extends QuillBlotHeader {
}

export default BlotHeader;
