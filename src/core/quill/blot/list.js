// TODO: node_moduleから読み込みたい。
const Quill = window.Quill;
const QuillBlotList = Quill.import('formats/list');

class BlotList extends QuillBlotList {
}

export default BlotList;
